const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", "..", ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").trim();
    }
  });
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "200606",
  database: process.env.DB_NAME || "computer_component_store",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
