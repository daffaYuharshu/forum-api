const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteReplyUseCase", () => {
  it("should throw error if delete reply not contain needed parameter", async () => {
    /** creating use case instance */
    const getCommentUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(getCommentUseCase.execute()).rejects.toThrow(
      "DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER"
    );
  });

  it("should throw error if delete reply parameter not meet data type specification", async () => {
    /** creating use case instance */
    const getCommentUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(
      getCommentUseCase.execute(123, "user-123")
    ).rejects.toThrow(
      "DELETE_REPLY_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should orchestrating the delete reply action correctly", async () => {
    // Arrange
    const replyId = "reply-123";
    const userId = "user-123";

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.verifyReplyAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await getReplyUseCase.execute(replyId, userId);

    // Assert
    expect(mockReplyRepository.verifyReplyAvailability).toBeCalledWith(
      replyId
    );
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      replyId,
      userId
    );
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(replyId);
  });
});
