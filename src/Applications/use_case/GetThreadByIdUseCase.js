const DetailThread = require("../../Domains/threads/entities/DetailThread");
const DetailComment = require("../../Domains/comments/entities/DetailComment");
const DetailReply = require("../../Domains/replies/entities/DetailReply");

class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    if (!threadId) {
      throw new Error("GET_THREAD_BY_ID_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER");
    }

    if (typeof threadId !== "string") {
      throw new Error(
        "GET_THREAD_BY_ID_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }

    await this._threadRepository.verifyThreadAvailability(threadId);

    const detailThread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    const mappedComments = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(
          comment.id
        );
        const mappedReplies = replies
          .filter((reply) => reply.commentId === comment.id)
          .map(
            (reply) =>
              new DetailReply({
                id: reply.id,
                content: reply.isDelete
                  ? "**balasan telah dihapus**"
                  : reply.content,
                date: reply.date,
                username: reply.username,
              })
          );

        return new DetailComment({
          id: comment.id,
          content: comment.isDelete
            ? "**komentar telah dihapus**"
            : comment.content,
          date: comment.date,
          username: comment.username,
          replies: mappedReplies,
        });
      })
    );

    return new DetailThread({
      ...detailThread,
      comments: mappedComments,
    });
  }
}

module.exports = GetThreadByIdUseCase;
