import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./StudentDashboard.css";

function Login() {
  const [formData, setFormData] = useState({
    StudentEmail: "",
    Password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage("");
  };

  const validateLoginForm = () => {
    const email = formData.StudentEmail.trim();
    const password = formData.Password;

    if (!email) {
      return "Please enter your email address.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (!password) {
      return "Please enter your password.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationError = validateLoginForm();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token || data.data?.token;
        const centralData = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(centralData));

        const userData = {
          ...decodedPayload,
          ...(data.user || {}),
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      } else {
        setMessage(data.message || "Invalid email or password. Please try again.");
      }
    } catch (error) {
      setMessage("Unable to connect to the authentication server. Please verify the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pro-auth-wrapper">
      <div className="pro-auth-card">
        <div className="pro-auth-brand">
          <div className="pro-brand-badge">E</div>
          <span style={{ fontWeight: 700, fontSize: "16px", letterSpacing: "-0.3px" }}>
            EDU<span style={{ color: "#818cf8" }}>SPHERE</span>
          </span>
        </div>

        <div className="pro-auth-header">
          <h2>Sign in to your account</h2>
          <p>Access your AI learning workspace, assessments, and study roadmaps.</p>
        </div>

        {message && <div className="status-alert error">{message}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="pro-form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="StudentEmail"
              className="pro-input"
              placeholder="name@university.edu"
              value={formData.StudentEmail}
              onChange={handleChange}
            />
          </div>

          <div className="pro-form-group">
            <label>Password</label>
            <input
              type="password"
              name="Password"
              className="pro-input"
              placeholder="Enter your password"
              value={formData.Password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="pro-btn-primary"
            style={{ width: "100%", marginTop: "8px" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In to Workspace"}
          </button>
        </form>

        <div className="pro-auth-footer">
          Don't have an account? <Link to="/register">Create a student account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;