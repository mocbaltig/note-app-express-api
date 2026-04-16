/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
// export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // create new user
  pgm.sql(
    "INSERT INTO users(id, username, password, fullname, created_at, updated_at) VALUES ('old_notes','old_notes','old_notes','old_notes', NOW(), NOW())",
  );

  // set owner to old_notes in notes with null owner
  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner IS NULL");

  // give foreign key constraint on owner to id of users
  pgm.addConstraint(
    'notes',
    'fk_notes.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // delete constraint
  pgm.dropConstraint('notes', 'fk_notes.owner_users.id');

  // set owner to null
  pgm.sql("UPDATE notes SET owner = NULL where owner = 'old_notes'");

  // delete the new user
  pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};
