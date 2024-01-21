// index.js

const express = require('express');
const app = express();
const connectdb = require('./db')

const bodyParser = require("body-parser");

// Import the auth router
const authRouter = require('./routes/auth'); // Adjust the path accordingly

connectdb();
// Middleware to parse JSON in the request body
app.use(express.json());
app.use(bodyParser.json());

// Mount the auth router at the specified path
app.use('/api/auth', authRouter);

// Other routes and configurations go here

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
