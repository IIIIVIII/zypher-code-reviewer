/**
 * Buggy Express API Server
 * This code has several intentional bugs for demonstration
 */

const express = require('express');
const app = express();

app.use(express.json());

// Bug 1: Database connection not initialized
let db;

// Bug 2: Missing error handling
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  
  // Bug 3: No input validation
  // Bug 4: SQL injection vulnerable
  const query = `INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}')`;
  
  // Bug 5: Using undefined db connection
  db.query(query, (err, result) => {
    if (err) {
      res.status(500).send('Error');
    }
    res.json({ success: true, userId: result.insertId });
  });
});

// Bug 6: Missing route parameters validation
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  
  // Bug 7: Another SQL injection vulnerability
  db.query(`SELECT * FROM users WHERE id = ${userId}`, (err, results) => {
    res.json(results[0]);
  });
});

// Bug 8: Password sent in plain text
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`, 
    (err, results) => {
      if (results.length > 0) {
        res.json({ success: true, user: results[0] });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
});

// Bug 9: Missing PORT environment variable handling
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
