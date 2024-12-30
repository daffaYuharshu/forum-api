const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist Add Comment', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
      });

      // Arrange
      const addComment = new AddComment({
        content: 'content',
      });

      const fakeIdGenerator = () => '123'; // stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment, ownerId, threadId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        'comment-123',
      );
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
      });

      // Arrange
      const addComment = new AddComment({
        content: 'content',
      });
      const fakeIdGenerator = () => '123'; // stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment,
        ownerId,
        threadId,
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'content',
          owner: ownerId,
        }),
      );
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment is not available', async () => {
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAvailability(commentId),
      ).rejects.toThrow(NotFoundError);
    });

    it('should not return NotFoundError when comment is available', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: ownerId,
        threadId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAvailability(commentId),
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when user is not comment owner', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: ownerId,
        threadId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(commentId, 'user-321'),
      ).rejects.toThrow(AuthorizationError);
    });

    it('should not return AuthorizationError when user is comment owner', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: ownerId,
        threadId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'),
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should modify is_delete attribute of comment', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: ownerId,
        threadId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const findCommentById = await CommentsTableTestHelper.findCommentsById(
        'comment-123',
      );
      expect(findCommentById[0].is_delete).toBe(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments array correctly', async () => {
      const threadId = 'thread-123';
      const ownerId = 'user-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        threadId,
      );

      expect(comments).toStrictEqual([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: new Date('2024-12-05T03:29:19.775Z').toISOString(),
          content: 'content',
          isDelete: false,
        },
      ]);
    });
  });
});
