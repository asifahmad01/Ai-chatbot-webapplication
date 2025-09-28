const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// Sign-Up Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err.code === 11000) {
      // Handle duplicate email error
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Internal server error", details: err.message });
    }
  }
});

// Log-In Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Return user details with the response
    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
