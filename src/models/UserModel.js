const db = require("../config/DBConnection");

function safeUser(user) {
  if (!user) return null;
  const { password: _password, ...withoutPassword } = user;
  return withoutPassword;
}

async function findByEmail(email) {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
}

async function create({ name, email, password }) {
  const [result] = await db.execute(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'customer')",
    [name, email, password]
  );
  const [rows] = await db.execute("SELECT * FROM users WHERE id = ? LIMIT 1", [result.insertId]);
  return safeUser(rows[0]);
}

async function verify(email, password) {
  const user = await findByEmail(email);
  if (!user || user.password !== password) return null;
  return safeUser(user);
}

module.exports = { findByEmail, create, verify };
