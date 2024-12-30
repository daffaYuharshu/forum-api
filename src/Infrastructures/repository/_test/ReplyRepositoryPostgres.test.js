const pool = require('../../database/postgres/pool');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist Add Reply', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
      });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Arrange
      const addReply = new AddReply({
        content: 'content',
      });

      const fakeIdGenerator = () => '123'; // stub!

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await replyRepositoryPostgres.addReply(addReply, ownerId, commentId);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
      });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Arrange
      const addReply = new AddReply({
        content: 'content',
      });
      const fakeIdGenerator = () => '123'; // stub!

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(
        addReply,
        ownerId,
        commentId,
      );

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: 'content',
          owner: ownerId,
        }),
      );
    });
  });

  describe('verifyReplyAvailability function', () => {
    it('should throw NotFoundError when reply is not available', async () => {
      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Assert
      await expect(
        replyRepositoryPostgres.verifyReplyAvailability(replyId),
      ).rejects.toThrow(NotFoundError);
    });

    it('should not return NotFoundError when reply is available', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: ownerId,
        threadId,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        owner: ownerId,
        commentId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyAvailability(replyId),
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when user is not reply owner', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: ownerId,
        threadId,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        owner: ownerId,
        commentId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner(replyId, 'user-321'),
      ).rejects.toThrow(AuthorizationError);
    });

    it('should not return AuthorizationError when user is reply owner', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: ownerId,
        threadId,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        owner: ownerId,
        commentId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'),
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should modify is_delete attribute of reply', async () => {
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'user' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: ownerId,
        threadId,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        owner: ownerId,
        commentId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById(replyId);

      // Assert
      const findReplyById = await RepliesTableTestHelper.findRepliesById(
        'reply-123',
      );
      expect(findReplyById[0].is_delete).toBe(true);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies array correctly', async () => {
      const threadId = 'thread-123';
      const ownerId = 'user-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: ownerId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: ownerId,
        threadId,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        owner: ownerId,
        commentId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getRepliesByCommentId(
        commentId,
      );

      expect(replies).toStrictEqual([
        {
          id: 'reply-123',
          username: 'dicoding',
          date: new Date('2024-12-05T03:29:19.775Z').toISOString(),
          content: 'content',
          isDelete: false,
          commentId: 'comment-123',
        },
      ]);
    });
  });
});
