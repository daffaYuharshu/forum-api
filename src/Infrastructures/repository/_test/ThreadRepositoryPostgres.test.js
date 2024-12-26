const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist Add Thread", async () => {
      const ownerId = "user-12345";
      await UsersTableTestHelper.addUser({ id: ownerId, username: "user" });

      // Arrange
      const addThread = new AddThread({
        title: "ini title",
        body: "ini body",
      });

      const fakeIdGenerator = () => "123"; // stub!

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread, ownerId);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(
        "thread-123"
      );
      expect(threads).toHaveLength(1);
    });

    it("should return added thread correctly", async () => {
      const ownerId = "user-12345";
      await UsersTableTestHelper.addUser({ id: ownerId, username: "user" });

      // Arrange
      const addThread = new AddThread({
        title: "ini title",
        body: "ini body",
      });
      const fakeIdGenerator = () => "123"; // stub!

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(
        addThread,
        ownerId
      );

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "ini title",
          owner: ownerId,
        })
      );
    });
  });

  describe("verifyThreadAvailability function", () => {
    it("should throw NotFoundError when thread is not available", async () => {
      const threadId = "thread-123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyThreadAvailability(threadId)
      ).rejects.toThrow(NotFoundError);
    });

    it("should not return NotFoundError when thread is available", async () => {
      const ownerId = "user-123";
      const threadId = "thread-123";

      await UsersTableTestHelper.addUser({ id: ownerId, username: "user" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: ownerId });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability(threadId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
