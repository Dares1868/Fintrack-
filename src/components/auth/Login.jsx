import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/introStart.css";
import authService from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check if there's a success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });

      // Store user info and navigate to dashboard
      localStorage.setItem("userFullName", response.user.name);
      navigate("/app/dashboard");
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="intro-gradient-bg">
      <span className="logo-top">FinTrack</span>
      <div className="login-center">
        <h1 className="login-title">Welcome back</h1>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="forgotPassword-bottom-link">
            <button
              type="button"
              className="link-btn"
              onClick={() => navigate("/ForgotPassword")}
            >
              Forgot password?
            </button>
          </div>
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="login-bottom-link">
          <span>Don't have an account?</span>
          <button className="link-btn" onClick={() => navigate("/register")}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
