// server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 4001;

// Middleware
app.use(cors()); 
app.use(express.json()); 

const users = [
  { username: 'user1', password: 'password1', complianceScore: 85, pendingTasks: 5, controlsImplemented: 12 },
  { username: 'user2', password: 'password2', complianceScore: 70, pendingTasks: 10, controlsImplemented: 10 }
];

const secretKey = 'f7530631df3a9dd163d2716a72491c27da7359e016628a4af9b254dcabb64fde1fc04a55dbde8f0f00b9a619f5247588f29811a3fcb8597c4f6e71636d1b5680';

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
    
    req.user = decoded; 
    next();
  });
};

// Compliance data endpoint for authenticated users
app.get('/api/compliance-data', verifyToken, (req, res) => {
  
  const user = users.find(u => u.username === req.user.username);
  
  if (user) {
    res.json({
      complianceScore: user.complianceScore,
      pendingTasks: user.pendingTasks,
      controlsImplemented: user.controlsImplemented
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
