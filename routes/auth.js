const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Harryisagoodb$oy';

// Create a user using: POST "/api/auth/createuser". No login required.

// Define a POST route for creating a user
router.post('/createuser', [
  // Validation middleware for user input
  body("name", "Enter a valid name").isLength({ min: 5 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be 5 characters").isLength({ min: 5 }),
], async (req, res) => {
  try {
    console.log('Reached the /api/auth/createuser POST route');

    // Destructure user input from the request body
    const { name, email, password } = req.body;

    // Validate user input using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check whether the user with this email exists already 
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      // Return an error response with existing user information
      return res.status(400).json({ error: "A user with this email already exists", existingUser: existingUser });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
      name: name,
      password: secPass,
      email: email,
    });

    const data = {
      user: {
        id: newUser.id
      }
    };

    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken });

  } catch (error) {
    // Handle any errors that occur during user creation
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Authenticate a user using: POST "/api/auth/login". No login required.

router.post('/login', [
  // Validation middleware for user input
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password cannot be blank").exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, existingUser.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: existingUser.id
      }
    };

    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken });

  } catch (error) {
    // Handle any errors that occur during user authentication
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
