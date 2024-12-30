const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(userId, commentId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deleteLike(userId, commentId) {
    const query = {
      text: 'DELETE FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await this._pool.query(query);
  }

  async verifyLikeAvailability(userId, commentId) {
    const query = {
      text: 'SELECT * FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [userId, commentId],
    };
    const result = await this._pool.query(query);

    return !!result.rowCount;
  }

  async getLikesByCommentId(commentId) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;
