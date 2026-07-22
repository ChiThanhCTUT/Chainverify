const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'chainverify';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;

// Tự động kiểm tra và tạo Database trên XAMPP MySQL nếu chưa tồn tại
async function ensureDatabaseExists() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();
    console.log(`[Database] Đã kết nối XAMPP MySQL & đảm bảo database '${DB_NAME}' tồn tại.`);
  } catch (err) {
    console.warn(`[Database Warning] Chưa thể tự tạo DB tự động (${err.message}). Vui lòng đảm bảo MySQL trên XAMPP đã BẬT (Start MySQL).`);
  }
}

ensureDatabaseExists();

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
