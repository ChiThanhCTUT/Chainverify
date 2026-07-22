const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'chainverify',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  }
);

module.exports = sequelize;
