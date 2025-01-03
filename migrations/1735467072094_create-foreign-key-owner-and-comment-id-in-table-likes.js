/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addConstraint(
    'likes',
    'unique_owner_and_comment_id',
    'UNIQUE(owner, comment_id)',
  );

  pgm.addConstraint(
    'likes',
    'fk_likes.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'likes',
    'fk_likes.comment_id_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('likes', 'unique_owner_and_comment_id');
  pgm.dropConstraint('likes', 'fk_likes.owner_users.id');
  pgm.dropConstraint('likes', 'fk_likes.comment_id_comments.id');
};
