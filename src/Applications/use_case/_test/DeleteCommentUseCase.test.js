const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should throw error if delete comment not contain needed parameter", async () => {
    /** creating use case instance */
    const getCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(getCommentUseCase.execute()).rejects.toThrow(
      "DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER"
    );
  });

  it("should throw error if delete comment parameter not meet data type specification", async () => {
    /** creating use case instance */
    const getCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(
      getCommentUseCase.execute(123, "user-123")
    ).rejects.toThrow(
      "DELETE_COMMENT_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should orchestrating the delete comment action correctly", async () => {
    // Arrange
    const commentId = "comment-123";
    const userId = "user-123";

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

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
