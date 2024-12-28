const AddReply = require("../../../Domains/replies/entities/AddReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe("AddReplyUseCase", () => {
  it("should throw error if add reply not contain needed parameter", async () => {
    // Arrange
    const useCasePayload = {
      content: "content",
    };

    /** creating use case instance */
    const getCommentUseCase = new AddReplyUseCase({});

    // Action & Assert
    await expect(
      getCommentUseCase.execute(useCasePayload, null, null, "comment-123")
    ).rejects.toThrow("ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER");
  });

  it("should throw error if add reply parameter not meet data type specification", async () => {
    // Arrange
    const useCasePayload = {
      content: "content",
    };

    /** creating use case instance */
    const getCommentUseCase = new AddReplyUseCase({});

    // Action & Assert
    await expect(
      getCommentUseCase.execute(useCasePayload, 123, true, 321)
    ).rejects.toThrow("ADD_REPLY_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should orchestrating the add reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "content",
    };
    const mockAddedReply = new AddedReply({
      id: "reply-123",
      content: useCasePayload.content,
      owner: "user-123",
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    /** creating use case instance */
    const getReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await getReplyUseCase.execute(
      useCasePayload,
      "user-123",
      "thread-123",
      "comment-123"
    );

    // Assert
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: "reply-123",
        content: "content",
        owner: "user-123",
      })
    );

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      "thread-123"
    );
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      "comment-123"
    );
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply({
        content: "content",
      }),
      "user-123",
      "comment-123"
    );
  });
});
