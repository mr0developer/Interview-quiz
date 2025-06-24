const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "super_secret";

// =========================
// Registration Route
// =========================
app.post("/api/register", async (req, res) => {
  const {
    username,
    email,
    password,
    department_id,
    job_category_id,
    phone_number,
    address,
  } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    !department_id ||
    !job_category_id ||
    !phone_number ||
    !address
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const userStmt = db.prepare(
      "INSERT INTO users (username, email, password, department_id, job_category_id) VALUES (?, ?, ?, ?, ?)"
    );
    const userResult = userStmt.run(username, email, hashedPassword, department_id, job_category_id);
    const userId = userResult.lastInsertRowid;

    const profileStmt = db.prepare(
      "INSERT INTO user_profiles (user_id, phone_number, address) VALUES (?, ?, ?)"
    );
    profileStmt.run(userId, phone_number, address);

    res.json({ message: "User registered successfully" });
  } catch (error) {
  console.error("Registration error:", error);
  res.status(500).json({ error: `An error occurred: ${error.message}` }); 
}
});

// =========================
// Login Route
// =========================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// =========================
// Authentication Middleware
// =========================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(403).json({ error: "Invalid or expired token" });
  }
}

// =========================
// Protected Route
// =========================
app.get("/api/dashboard", authenticateToken, (req, res) => {
  const userStmt = db.prepare(
    `SELECT u.username, u.email, d.name AS department, j.name AS job_category,
            p.phone_number, p.address
     FROM users u
     LEFT JOIN departments d ON u.department_id = d.id
     LEFT JOIN job_categories j ON u.job_category_id = j.id
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE u.email = ?`
  );
  const user = userStmt.get(req.user.email);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user }); // Returns the combined user object
});

// =========================
// New GET Endpoints
// =========================
app.get("/api/departments", (req, res) => {
  const departments = db.prepare("SELECT * FROM departments").all();
  res.json(departments);
});

app.get("/api/job_categories", (req, res) => {
  const jobs = db.prepare("SELECT * FROM job_categories").all();
  res.json(jobs);
});

// =========================
// Start Server
// =========================
app.listen(3001, () => {
  console.log("✅ Backend running at http://localhost:3001");
});
