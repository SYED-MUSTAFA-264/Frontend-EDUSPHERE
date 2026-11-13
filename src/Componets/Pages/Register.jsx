import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./StudentDashboard.css";

function Register() {
  const [formData, setFormData] = useState({
    StudentName: "",
    StudentEmail: "",
    Phone: "",
    ProfileImage: "",
    Password: "",
    ConfirmPassword: "",
    Role: "student",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage("");
  };

  const validateRegisterForm = () => {
    const name = formData.StudentName.trim();
    const email = formData.StudentEmail.trim();
    const phone = formData.Phone.trim();
    const password = formData.Password;
    const confirmPassword = formData.ConfirmPassword;

    if (!name) {
      return "Please enter your full name.";
    }
    if (name.length < 3) {
      return "Full name must be at least 3 characters long.";
    }

    if (!email) {
      return "Please enter your email address.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address (e.g. student@university.edu).";
    }

    if (phone) {
      const phoneRegex = /^[+\d][\d\s-]{9,15}$/;
      if (!phoneRegex.test(phone)) {
        return "Please enter a valid phone number (10 to 15 digits).";
      }
    }

    if (!password) {
      return "Please enter a password.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter (A-Z).";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter (a-z).";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number (0-9).";
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]/.test(password)) {
      return "Password must contain at least one special character (e.g. @, #, $, !).";
    }

    if (!confirmPassword) {
      return "Please confirm your password.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match. Please verify both fields.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationError = validateRegisterForm();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://backend-edu-git-main-mobi-llm.vercel.app/Register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setMessage(data.message || "Registration could not be completed.");
      }
    } catch (error) {
      setMessage("Unable to connect to the server. Please ensure the backend service is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pro-auth-wrapper">
      <div className="pro-auth-card" style={{ maxWidth: "480px" }}>
        <div className="pro-auth-brand">
          <div className="pro-brand-badge">E</div>
          <span style={{ fontWeight: 700, fontSize: "16px", letterSpacing: "-0.3px" }}>
            EDU<span style={{ color: "#818cf8" }}>SPHERE</span>
          </span>
        </div>

        <div className="pro-auth-header">
          <h2>Create your student account</h2>
          <p>Set up your academic profile to unlock AI tutoring and automated assessments.</p>
        </div>

        {message && <div className="status-alert error">{message}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="pro-form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="StudentName"
              className="pro-input"
              placeholder="e.g. Syed Mustafa"
              value={formData.StudentName}
              onChange={handleChange}
            />
          </div>

          <div className="pro-form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="StudentEmail"
              className="pro-input"
              placeholder="student@university.edu"
              value={formData.StudentEmail}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="pro-form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="Phone"
                className="pro-input"
                placeholder="+92 300 1234567"
                value={formData.Phone}
                onChange={handleChange}
              />
            </div>

            <div className="pro-form-group">
              <label>Profile Avatar URL (Optional)</label>
              <input
                type="text"
                name="ProfileImage"
                className="pro-input"
                placeholder="https://..."
                value={formData.ProfileImage}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="pro-form-group">
              <label>Password</label>
              <input
                type="password"
                name="Password"
                className="pro-input"
                placeholder="••••••••"
                value={formData.Password}
                onChange={handleChange}
              />
            </div>

            <div className="pro-form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="ConfirmPassword"
                className="pro-input"
                placeholder="••••••••"
                value={formData.ConfirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="pro-btn-primary"
            style={{ width: "100%", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Complete Registration"}
          </button>
        </form>

        <div className="pro-auth-footer">
          Already registered? <Link to="/login">Sign in to your account</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;