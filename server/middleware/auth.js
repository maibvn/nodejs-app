const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Session = require("../models/session");
const router = express.Router();

// Since we use same domain (localhost)
// =>  same auth logic/ shared session for 2 app (admin + client)

// Route for user signup
router.post("/signup", async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      isAdmin: email === "admin@admin.com" ? true : false,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    // Validate
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    req.session.userId = user._id; // Store the user ID in the session

    // Save the session ID and user reference in the Session collection
    const session = new Session({
      sessionId: req.sessionID, // req.sessionID contains the session ID
      user: user._id,
    });

    await session.save();

    User.findById(user._id)
      .then((user) => {
        // Send a response with role to handle routing
        res.status(200).json({
          message: "Login successfully",
          role: user.role,
        });
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  try {
    // Destroy the session
    req.session.destroy(async (err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      // Remove session from the database
      await Session.deleteOne({ sessionId: req.sessionID });
      // Clear the session cookie
      res.clearCookie("connect.sid", { path: "/" });
      res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
});

router.get("/check-auth", async (req, res) => {
  try {
    // Retrieve session ID from cookies
    const sessionId = req.sessionID; // This gets the connect.sid from the request
    if (!sessionId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    // Find session in the database
    const session = await Session.findOne({ sessionId }).populate("user");

    if (!session) {
      return res
        .status(401)
        .json({ message: "Session not found or expired. Please log in!" });
    }
    //Remove password from userData
    const userData = {
      _id: session.user._id,
      fullName: session.user.fullName,
      email: session.user.email,
      phone: session.user.phone,
      role: session.user.role,
      orders: session.user.orders,
      address: session.user.address,
    };
    // If session is valid, send back user data
    res.status(200).json({ message: "Authenticated", user: userData });
  } catch (error) {
    console.error("Error checking authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
