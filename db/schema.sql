-- MySQL Database Schema for ONLINE FOOD ORDERING SYSTEM (OFOS)
-- Run this in MySQL Workbench or via: mysql -u root -p < db/schema.sql

CREATE DATABASE IF NOT EXISTS ofos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ofos_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  avatar TEXT,
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Delivery Addresses Table
CREATE TABLE IF NOT EXISTS user_addresses (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  label VARCHAR(50) DEFAULT 'Home',
  receiver_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  street TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  zip VARCHAR(20) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(20),
  image TEXT
);

-- 4. Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5,
  delivery_time VARCHAR(50),
  price_range VARCHAR(10),
  cuisine VARCHAR(255),
  image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  tag VARCHAR(50)
);

-- 5. Food Items Table
CREATE TABLE IF NOT EXISTS foods (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  restaurant_id VARCHAR(64),
  restaurant_name VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5,
  reviews_count INT DEFAULT 0,
  description TEXT,
  image TEXT,
  is_veg BOOLEAN DEFAULT TRUE,
  prep_time VARCHAR(50),
  is_available BOOLEAN DEFAULT TRUE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_recommended BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL
);

-- 6. User Favorites
CREATE TABLE IF NOT EXISTS user_favorites (
  user_id VARCHAR(64) NOT NULL,
  food_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, food_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  subtotal DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  coupon_code VARCHAR(50),
  delivery_fee DECIMAL(10,2) DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address JSON NOT NULL,
  payment_method VARCHAR(100),
  payment_status VARCHAR(50) DEFAULT 'Paid (Demo)',
  status VARCHAR(50) DEFAULT 'placed',
  status_stage INT DEFAULT 1,
  status_label VARCHAR(100) DEFAULT 'Order Placed',
  driver_name VARCHAR(100),
  driver_phone VARCHAR(50),
  estimated_delivery_time VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  food_id VARCHAR(64) NOT NULL,
  food_name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  image TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 9. Order Tracking Events Table
CREATE TABLE IF NOT EXISTS order_tracking_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  stage INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  note TEXT,
  event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
