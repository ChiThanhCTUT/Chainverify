CREATE DATABASE IF NOT EXISTS chainverify;
USE chainverify;

CREATE TABLE IF NOT EXISTS certificates (
  id VARCHAR(255) PRIMARY KEY,
  recipientName VARCHAR(255) NOT NULL,
  courseProgram VARCHAR(255) NOT NULL,
  issueDate DATE NOT NULL,
  status ENUM('Valid', 'Revoked', 'Pending') DEFAULT 'Pending',
  txHash VARCHAR(255),
  checksum VARCHAR(255),
  issuerName VARCHAR(255),
  issuerLogo VARCHAR(255),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
