#!/usr/bin/node
const express = require('express');
const routes = require('./routes/index');

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// !Use the routes defined in routes/index.js
app.use('/', routes);

// Start the server
app.listen(port, 'localhost', () => {
  console.log(`Server is running at http://localhost:${port}`);
});
