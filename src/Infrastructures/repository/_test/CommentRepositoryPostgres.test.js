const pool = require("../../database/postgres/pool");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist Add Comment", async () => {
      const ownerId = "user-123";
      const threadId = "thread-123";

      await UsersTableTestHelper.addUser({ id: ownerId, username: "user" });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
      });

      // Arrange
      const addComment = new AddComment({
        content: "content",
      });

      const fakeIdGenerator = () => "123"; // stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment, ownerId, threadId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      const ownerId = "user-123";
      const threadId = "thread-123";
      await UsersTableTestHelper.addUser({ id: ownerId, username: "user" });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
      });

      // Arrange
      const addComment = new AddComment({
        content: "content",
      });
      const fakeIdGenerator = () => "123"; // stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment,
        ownerId,
        threadId
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "content",
          owner: ownerId,
        })
      );
    });
  });
});
