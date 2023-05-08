const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// middlewares for CORS and json parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve API routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/bikes',require('./routes/api/bikes'));
app.use('/api/orders',require('./routes/api/orders'));

// Serve static content
app.use(express.static('public'));
app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'public','index.html'));
})

// Forward invalid routes to the error handler below
app.use((req,res,next) => {
    const error = new Error('Page Not found');
    error.httpCode = 404;
    next(error);
})

// Handle all errors thrown
app.use((err,req,res,next) => {
    res.status(err.httpCode || 500 ).json({ error: {msg:err.message || 'Server error' }})
});

module.exports = app;