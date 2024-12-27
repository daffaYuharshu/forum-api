const AddReply = require("../../../Domains/replies/entities/AddReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe("AddReplyUseCase", () => {
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
      .mockImplementation(() => Promise.resolve("thread-123"));
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve("comment-123"));
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
