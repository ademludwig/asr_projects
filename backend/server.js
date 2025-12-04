require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // ✅ add cors

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// ----------------- CORS Middleware -----------------
app.use(cors({
    origin: 'http://localhost:5173', // frontend origin
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));

const SECRET_KEY = process.env.JWT_SECRET;

// ----------------- Database connection -----------------
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// ----------------- Middleware: Authenticate Token -----------------
function authenticateToken(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

// ----------------- Middleware: Check Admin -----------------
function checkAdmin(req, res, next) {
    if (!req.user.is_admin) {
        return res.status(403).json({ message: "Access denied: Admins only." });
    }
    next();
}

// ----------------- 1. Register -----------------
app.post("/register", async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        if (!email || !password || !first_name || !last_name)
            return res.status(400).json({ message: "All fields required" });

        const [existing] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
        if (existing.length > 0)
            return res.status(400).json({ message: "Email already exists" });

        const hash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO user (email, password, first_name, last_name) 
             VALUES (?, ?, ?, ?)`,
            [email, hash, first_name, last_name]
        );

        res.json({ success: true, userId: result.insertId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ----------------- 2. Login -----------------
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
        if (rows.length === 0)
            return res.status(401).json({ message: "Invalid credentials" });

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ message: "Invalid credentials" });

        // token now includes is_admin
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                is_admin: user.is_admin
            },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({ success: true, token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ----------------- 3. List Candidates -----------------
app.get("/candidates", authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM vote");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ----------------- 4. Submit Vote -----------------
app.post("/vote", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { vote_id } = req.body;

        const [voteCheck] = await pool.query("SELECT * FROM vote WHERE id=?", [vote_id]);
        if (voteCheck.length === 0)
            return res.status(400).json({ message: "Invalid candidate" });

        const [userCheck] = await pool.query("SELECT vote_id FROM user WHERE id=?", [userId]);
        if (userCheck[0].vote_id !== null)
            return res.status(400).json({ message: "You already voted" });

        await pool.query("UPDATE user SET vote_id=? WHERE id=?", [vote_id, userId]);
        await pool.query("UPDATE vote SET counter = counter + 1 WHERE id=?", [vote_id]);

        res.json({ success: true, message: `Vote submitted for ${voteCheck[0].name}` });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ----------------- 5. Show My Vote -----------------
app.get("/myvote", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [rows] = await pool.query(
            `SELECT v.id, v.name, v.counter
             FROM user u
             JOIN vote v ON u.vote_id = v.id
             WHERE u.id = ?`,
            [userId]
        );

        if (rows.length === 0)
            return res.json({ message: "You have not voted yet" });

        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ----------------- 6. ADMIN: Add Candidate -----------------
app.post("/admin/candidate", authenticateToken, checkAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Name required" });

        await pool.query("INSERT INTO vote (name, counter) VALUES (?, 0)", [name]);

        res.json({ success: true, message: "Candidate added successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ----------------- Start Server -----------------
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
