const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  recipientName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  courseProgram: {
    type: DataTypes.STRING,
    allowNull: false
  },
  issueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  },
  txHash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  checksum: {
    type: DataTypes.STRING,
    allowNull: true
  },
  issuerName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  issuerLogo: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'certificates',
  timestamps: true
});

module.exports = Certificate;
