const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the delete comment action correctly", async () => {
    // Arrange
    const commentId = "comment-123";
    const userId = "user-123";

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentId));
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentId, userId));
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentId));

    /** creating use case instance */
    const getCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await getCommentUseCase.execute(commentId, userId);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      commentId
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      commentId,
      userId
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(commentId);
  });
});
