const User = require("../models/User");
const { initializeDatabase } = require("../config/database");

// Initialize database connection when controller loads
initializeDatabase().catch(console.error);

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
        details: "Name, email, and password must be provided",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Check password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return res.status(400).json({
        error:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        details:
          "Required: A-Z, a-z, 0-9, and special characters (!@#$%^&* etc.)",
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
        details: "An account with this email address already exists",
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
    });

    console.log("User registered successfully:", {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });

    // For now, we'll skip email verification and log success
    console.log("Email verification would be sent to:", email);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.toJSON(),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      details: "An internal server error occurred",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        details: "Email or password is incorrect",
      });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
        details: "Email or password is incorrect",
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Set session
    req.session.userId = user.id;
    req.session.user = user.toJSON();

    console.log("User logged in successfully:", {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    res.json({
      message: "Login successful",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      details: "An internal server error occurred",
    });
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
          error: "Logout failed",
          details: "Could not destroy session",
        });
      }

      res.clearCookie("connect.sid");
      res.json({
        message: "Logout successful",
      });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "Logout failed",
      details: "An internal server error occurred",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        error: "Not authenticated",
        details: "No active session found",
      });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        details: "User associated with session no longer exists",
      });
    }

    res.json({
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      error: "Failed to get user",
      details: "An internal server error occurred",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};
