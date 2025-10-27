const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { getPool } = require("../config/database");

class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.is_email_verified = userData.is_email_verified || false;
    this.email_verification_token = userData.email_verification_token;
    this.password_reset_token = userData.password_reset_token;
    this.password_reset_expires = userData.password_reset_expires;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
    this.last_login = userData.last_login;
  }

  static async create(userData) {
    const pool = getPool();

    try {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString("hex");

      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password, email_verification_token) 
         VALUES (?, ?, ?, ?)`,
        [userData.name, userData.email, hashedPassword, emailVerificationToken]
      );

      // Return the created user (without password)
      const [rows] = await pool.execute(
        `SELECT id, name, email, is_email_verified, created_at, updated_at 
         FROM users WHERE id = ?`,
        [result.insertId]
      );

      return new User(rows[0]);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async findByEmail(email) {
    const pool = getPool();

    try {
      const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (rows.length === 0) {
        return null;
      }

      return new User(rows[0]);
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  static async findById(id) {
    const pool = getPool();

    try {
      const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [
        id,
      ]);

      if (rows.length === 0) {
        return null;
      }

      return new User(rows[0]);
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  async validatePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  async updateLastLogin() {
    const pool = getPool();

    try {
      await pool.execute(
        "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
        [this.id]
      );

      this.last_login = new Date();
    } catch (error) {
      console.error("Error updating last login:", error);
      throw error;
    }
  }

  async verifyEmail() {
    const pool = getPool();

    try {
      await pool.execute(
        "UPDATE users SET is_email_verified = true, email_verification_token = NULL WHERE id = ?",
        [this.id]
      );

      this.is_email_verified = true;
      this.email_verification_token = null;
    } catch (error) {
      console.error("Error verifying email:", error);
      throw error;
    }
  }

  // Return user data without sensitive information
  toJSON() {
    const {
      password,
      email_verification_token,
      password_reset_token,
      ...userWithoutSensitiveData
    } = this;
    return userWithoutSensitiveData;
  }
}

module.exports = User;
