class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(replyId, userId) {
    if (!replyId) {
      throw new Error("DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER");
    }

    if (typeof replyId !== "string") {
      throw new Error(
        "DELETE_REPLY_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }

    await this._replyRepository.verifyReplyAvailability(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, userId);
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
