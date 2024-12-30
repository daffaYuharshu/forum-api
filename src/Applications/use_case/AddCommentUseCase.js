const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, ownerId, threadId) {
    if (!ownerId || !threadId) {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    }

    if (typeof ownerId !== 'string' || typeof threadId !== 'string') {
      throw new Error(
        'ADD_COMMENT_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }

    await this._threadRepository.verifyThreadAvailability(threadId);
    const addComment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(addComment, ownerId, threadId);
  }
}

module.exports = AddCommentUseCase;
