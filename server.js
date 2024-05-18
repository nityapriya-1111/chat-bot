const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: '', // replace with your MySQL password if set
    database: 'database' // replace with the name of your database
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Create users table if it doesn't exist
const createUsersTable = `CREATE TABLE IF NOT EXISTS user (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
)`;

db.query(createUsersTable, (err, result) => {
    if (err) {
        console.error('Error creating table:', err);
        return;
    }
    console.log('Users table ready');
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'INSERT INTO user (email, password) VALUES (?, ?)';
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, message: 'Login successful' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
