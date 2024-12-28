const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");
const GetThreadByIdUseCase = require("../GetThreadByIdUseCase");
const DetailReply = require("../../../Domains/replies/entities/DetailReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("GetThreadByIdUseCase", () => {
  it("should throw error if get thread by id not contain needed parameter", async () => {
    /** creating use case instance */
    const getThreadByIdUseCase = new GetThreadByIdUseCase({});

    // Action & Assert
    await expect(getThreadByIdUseCase.execute()).rejects.toThrow(
      "GET_THREAD_BY_ID_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER"
    );
  });

  it("should throw error if get thread by id parameter not meet data type specification", async () => {
    /** creating use case instance */
    const getThreadByIdUseCase = new GetThreadByIdUseCase({});

    // Action & Assert
    await expect(getThreadByIdUseCase.execute(123)).rejects.toThrow(
      "GET_THREAD_BY_ID_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should orchestrating the get thread by id action correctly", async () => {
    // Arrange
    const threadId = "thread-123";

    const mockDetailThread = {
      id: threadId,
      title: "title",
      body: "body",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };

    const comments = [
      {
        id: "comment-123",
        username: "johndoe",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah komentar",
        isDelete: false,
      },
      {
        id: "comment-321",
        username: "dicoding",
        date: "2021-08-08T07:26:21.338Z",
        content: "sebuah komentar",
        isDelete: true,
      },
    ];

    const replies = [
      {
        id: "reply-123",
        username: "johndoe",
        commentId: "comment-123",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah balasan",
        isDelete: false,
      },
      {
        id: "reply-321",
        username: "johndoe",
        commentId: "comment-123",
        date: "2021-08-08T07:26:21.338Z",
        content: "sebuah balasan",
        isDelete: true,
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(replies));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toStrictEqual(
      new DetailThread({
        id: "thread-123",
        title: "title",
        body: "body",
        date: "2021-08-08T07:19:09.775Z",
        username: "dicoding",
        comments: [
          new DetailComment({
            id: "comment-123",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah komentar",
            replies: [
              new DetailReply({
                id: "reply-123",
                username: "johndoe",
                date: "2021-08-08T07:22:33.555Z",
                content: "sebuah balasan",
              }),
              new DetailReply({
                id: "reply-321",
                username: "johndoe",
                date: "2021-08-08T07:26:21.338Z",
                content: "**balasan telah dihapus**",
              }),
            ],
          }),
          new DetailComment({
            id: "comment-321",
            username: "dicoding",
            date: "2021-08-08T07:26:21.338Z",
            content: "**komentar telah dihapus**",
            replies: [],
          }),
        ],
      })
    );
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      "thread-123"
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      "thread-123"
    );
  });
});
