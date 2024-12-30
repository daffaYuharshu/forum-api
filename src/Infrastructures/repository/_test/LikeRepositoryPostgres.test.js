const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");

describe("LikeRepositoryPostgres", () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addLike function", () => {
    it("should Add Like to database", async () => {
      const ownerId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: ownerId, username: "user" });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
      });

      // Arrange
      const fakeIdGenerator = () => "123"; // stub!

      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await likeRepositoryPostgres.addLike(ownerId, commentId);

      // Assert
      const likes = await LikesTableTestHelper.findLikesById("like-123");
      expect(likes).toHaveLength(1);
    });
  });

  describe("verifyLikeAvailability function", () => {
    it("should return true if like is available", async () => {
      const userId = "user-123";
      const commentId = "comment-123";

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: userId, username: "user" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId: "thread-123",
      });
      await LikesTableTestHelper.addLike({});

      const isLiked = await likeRepositoryPostgres.verifyLikeAvailability(
        userId,
        commentId
      );

      // Assert
      await expect(isLiked).toEqual(true);
    });

    it("should return false if like is not available", async () => {
      const userId = "user-123";
      const commentId = "comment-123";

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: userId, username: "user" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
      });

      const isLiked = await likeRepositoryPostgres.verifyLikeAvailability(
        userId,
        commentId
      );

      // Assert
      await expect(isLiked).toEqual(false);
    });
  });

  describe("deleteLike function", () => {
    it("should delete Like from database", async () => {
      const ownerId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";
      const likeId = "like-123";

      await UsersTableTestHelper.addUser({ id: ownerId, username: "user" });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
      });
      await LikesTableTestHelper.addLike({ id: likeId });

      // Arrange

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteLike(ownerId, commentId);

      // Assert
      const likes = await LikesTableTestHelper.findLikesById(likeId);
      expect(likes).toHaveLength(0);
    });
  });

  describe("getLikesByCommentId function", () => {
    it("should return likes array by comment id correctly", async () => {
      const ownerId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: ownerId, username: "dicoding" });
      await UsersTableTestHelper.addUser({ id: "user-321", username: "user" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await LikesTableTestHelper.addLike({ id: "like-123", owner: ownerId });
      await LikesTableTestHelper.addLike({ id: "like-321", owner: "user-321" });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const likes = await likeRepositoryPostgres.getLikesByCommentId(
        commentId
      );

      expect(likes).toStrictEqual([
        {
          id: 'like-123',
          owner: "user-123",
          comment_id: 'comment-123',
        },
        {
          id: 'like-321',
          owner: "user-321",
          comment_id: 'comment-123',
        },
      ]);
    });
  });
});
