/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
    deleted_at: {
      type: "TIMESTAMP",
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
    pgm.dropTable("comments");
};
