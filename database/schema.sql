-- Civic Connect Database Schema
-- MySQL 8+

CREATE DATABASE IF NOT EXISTS civic_connect
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE civic_connect;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('citizen', 'admin') NOT NULL DEFAULT 'citizen',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- COMPLAINTS
-- ============================================================
CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id VARCHAR(20) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  category VARCHAR(80) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  status ENUM('SUBMITTED','UNDER REVIEW','ASSIGNED','IN PROGRESS','RESOLVED')
    NOT NULL DEFAULT 'SUBMITTED',
  priority ENUM('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL DEFAULT 'LOW',
  community_count INT NOT NULL DEFAULT 1,
  admin_remark TEXT NULL,
  resolution_email_sent TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_complaints_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_complaints_category (category),
  INDEX idx_complaints_status (status),
  INDEX idx_complaints_priority (priority),
  INDEX idx_complaints_location (location),
  INDEX idx_complaints_lat_lng (latitude, longitude)
) ENGINE=InnoDB;

-- ============================================================
-- COMPLAINT SUPPORTERS (citizens who reported/support the same issue)
-- ============================================================
CREATE TABLE IF NOT EXISTS complaint_supporters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_supporters_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  CONSTRAINT fk_supporters_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_complaint_user (complaint_id, user_id)
) ENGINE=InnoDB;

-- ============================================================
-- COMPLAINT STATUS HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS complaint_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  previous_status VARCHAR(30) NULL,
  new_status VARCHAR(30) NOT NULL,
  remark TEXT NULL,
  changed_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_history_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  CONSTRAINT fk_history_user FOREIGN KEY (changed_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================
-- COMPLAINT FEEDBACK (post-resolution)
-- ============================================================
CREATE TABLE IF NOT EXISTS complaint_feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  user_id INT NOT NULL,
  feedback ENUM('YES','NO') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_feedback_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_feedback_complaint_user (complaint_id, user_id)
) ENGINE=InnoDB;

-- ============================================================
-- RESOLUTION EMAIL LOG (avoid duplicate resolution emails per user/complaint)
-- ============================================================
CREATE TABLE IF NOT EXISTS resolution_email_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  user_id INT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reslog_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  CONSTRAINT fk_reslog_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_reslog (complaint_id, user_id)
) ENGINE=InnoDB;

-- ============================================================
-- Optional: seed a single admin account (edit email/password hash before running)
-- Generate a bcrypt hash for your chosen admin password and paste it below,
-- e.g. using: node -e "console.log(require('bcrypt').hashSync('YourPassword123!', 10))"
-- ============================================================
-- INSERT INTO users (name, email, phone, password, role)
-- VALUES ('City Admin', 'admin@civicconnect.local', '0000000000', '<BCRYPT_HASH_HERE>', 'admin');
