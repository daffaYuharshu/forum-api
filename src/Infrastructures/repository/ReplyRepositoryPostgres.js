const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply, owner, commentId) {
    const { content } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, commentId, createdAt, false],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async verifyReplyAvailability(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, userId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    const reply = result.rows[0];
    if (reply.owner !== userId) {
      throw new AuthorizationError(
        'Akses tidak sah. Harap periksa kredensial otentikasi Anda.',
      );
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = $1 WHERE id = $2 RETURNING id',
      values: [true, replyId],
    };

    await this._pool.query(query);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: 'SELECT replies.id, users.username, replies.date AT TIME ZONE \'UTC\' AS date, content, replies.is_delete AS "isDelete", replies.comment_id AS "commentId" FROM replies LEFT JOIN users ON replies.owner = users.id WHERE replies.comment_id = $1 ORDER BY replies.date ASC',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    const replies = result.rows.map((reply) => ({
      ...reply,
      date: new Date(reply.date).toISOString(),
    }));
    return replies;
  }
}

module.exports = ReplyRepositoryPostgres;
