const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, ownerId, threadId, commentId) {
    if (!ownerId || !threadId || !commentId) {
      throw new Error('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    }

    if (
      typeof ownerId !== 'string'
      || typeof threadId !== 'string'
      || typeof commentId !== 'string'
    ) {
      throw new Error(
        'ADD_REPLY_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }

    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);
    const addReply = new AddReply(useCasePayload);
    return this._replyRepository.addReply(
      addReply,
      ownerId,
      commentId,
    );
  }
}

module.exports = AddReplyUseCase;
