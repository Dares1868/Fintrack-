import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import { saveUser, userExists } from "../../utils/storage/userStorage";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [errors, setErrors] = useState({});
  const handleRegister = (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Incorrect email!";
    } else if (userExists(email)) {
      newErrors.email = "User already exists!";
    }

    if (password.length < 6) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
      if (!passwordRegex.test(password)) {
        newErrors.password =
          "Password should be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character (!@#$%^&* etc)!";
      }
      newErrors.password = "Password should have at least 1 number!";
    }

    if (password !== repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match!";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    saveUser({ fullName, email, password });
    navigate("/login");
  };

  return (
    <div className="intro-gradient-bg">
      <button className="back-btn" onClick={() => navigate("/login")}>
        &#8592;
      </button>
      <span className="logo-top">FinTrack</span>
      <div className="login-center">
        <h1 className="login-title">Create account</h1>
        <p className="register-subtitle">
          Join FinTrack to manage your finances
        </p>
        <form className="login-form" onSubmit={handleRegister}>
          <label>Full name</label>
          <input
            type="text"
            placeholder="Full name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}
          <label>Repeat password</label>
          <input
            type="password"
            placeholder="Repeat password"
            required
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          <p className="error">{errors.repeatPassword}</p>
          <button type="submit" className="login-btn">
            Create account
          </button>
        </form>
        <div className="login-bottom-link">
          <span>Already have an account?</span>
          <button className="link-btn" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
