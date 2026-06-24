const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, role TEXT, password TEXT)');
  db.run("INSERT INTO users(username, role, password) VALUES ('admin', 'admin', 'admin123')");
  db.run("INSERT INTO users(username, role, password) VALUES ('sam', 'user', 'password')");
});

function findUserUnsafe(username, cb) {
  // SAST: SQL injection via string concatenation
  const query = "SELECT id, username, role FROM users WHERE username = '" + username + "'";
  db.all(query, cb);
}

function loginUnsafe(username, password, cb) {
  // SAST: SQL injection in auth query
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  db.get(query, cb);
}

module.exports = { db, findUserUnsafe, loginUnsafe };
