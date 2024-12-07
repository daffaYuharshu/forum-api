const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");

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
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });

      // Arrange
      const addThread = new AddThread({
        title: "ini title",
        body: "ini body",
      });

      const fakeIdGenerator = () => "123"; // stub!

      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById("user-123");
      const owner = users[0].id;

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread, owner);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(
        "thread-123"
      );
      expect(threads).toHaveLength(1);
    });

    it("should return added thread correctly", async () => {
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });

      // Arrange
      const addThread = new AddThread({
        title: "ini title",
        body: "ini body",
      });
      const fakeIdGenerator = () => "123"; // stub!

      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById("user-123");
      const owner = users[0].id;

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread, owner);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "ini title",
          owner: "user-123",
        })
      );
    });
  });
});
