const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteReplyUseCase", () => {
  it("should orchestrating the delete reply action correctly", async () => {
    // Arrange
    const replyId = "reply-123";
    const userId = "user-123";

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.verifyReplyAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(replyId));
    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve(replyId, userId));
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(replyId));

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
