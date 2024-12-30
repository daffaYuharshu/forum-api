class LikeUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, commentId) {
    if (!commentId || !threadId) {
      throw new Error("LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER");
    }

    if (typeof commentId !== "string" || typeof threadId !== "string") {
      throw new Error(
        "LIKE_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }

    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);
    const isLiked = await this._likeRepository.verifyLikeAvailability(
      userId,
      commentId
    );

    if (isLiked) {
      return this._likeRepository.deleteLike(userId, commentId);
    } else {
      return this._likeRepository.addLike(userId, commentId);
    }
  }
}

module.exports = LikeUseCase;
