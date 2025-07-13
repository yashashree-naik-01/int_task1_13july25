require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) console.error(err);
    else console.log("Connected to MySQL");
});

app.get('/quote/:category', async (req, res) => {
    const category = req.params.category;
    db.query(
        "SELECT quote, author FROM quotes WHERE category = ? ORDER BY RAND() LIMIT 1",
        [category],
        (err, result) => {
            if (err) {
                res.status(500).json({ message: "Server error", error: err });
            } else if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: "No quote found for this category." });
            }
        }
    );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
