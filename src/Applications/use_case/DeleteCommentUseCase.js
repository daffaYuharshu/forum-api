class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId, userId) {
    if (!commentId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    }

    if (typeof commentId !== 'string') {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }

    await this._commentRepository.verifyCommentAvailability(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, userId);
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
