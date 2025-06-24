const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret';

// Registration Route
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    stmt.run(username, email, hashedPassword);
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token });
});

// Middleware for protected route
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']; 
  if (!authHeader) return res.sendStatus(401);
  
  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.sendStatus(403);
  }
}

// Protected Route
app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}!` });
});

// Start server
app.listen(3001, () => {
  console.log('✅ Backend running at http://localhost:3001');
});
