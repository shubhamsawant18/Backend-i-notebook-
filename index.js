// index.js

const express = require('express');
const app = express();
const connectdb = require('./db');
const bodyParser = require("body-parser");

// Import the auth and notes routers
const authRouter = require('./routes/auth'); // Assuming you have an auth route
const notesRouter = require('./routes/notes'); // Assuming you have a notes route

connectdb();

// Middleware to parse JSON in the request body
app.use(express.json());
app.use(bodyParser.json());

// Mount the auth router at the specified path
app.use('/api/auth', authRouter);

// Mount the notes router at the specified path
app.use('/api/notes', notesRouter); // Updated to use /api/notes route

// Other routes and configurations go here

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
