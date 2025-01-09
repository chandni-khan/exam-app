import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";

function Register() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setData({ ...data, email });
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        data
      );
      const { token, role, message } = response.data;

      if (token && role) {
        navigate("/");
      } else if (message) {
        setError(message);
      } else {
        setError("Unexpected server response. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const handleLoginRedirect = () => {
    navigate("/");
  };

  return (
    <div className="register-container">
      <div className="app-info">
        <h1 className="app-title">Welcome to APPGENIX QuizMaster!</h1>
        <p className="app-description">
          APPGENIX QuizMaster is an interactive platform for multiple-choice
          question exams. Whether you are a student aiming to sharpen your
          knowledge or an admin creating quizzes for others, QuizMaster provides
          a seamless and engaging experience.
          <br />
          <strong>
            Sign up now to start your journey of learning and assessment!
          </strong>
        </p>
      </div>

      <h2 className="register-heading">Register</h2>
      <Form onSubmit={handleSubmit} className="register-form">
        <Form.Group controlId="formUsername" className="form-group">
          <Form.Label className="form-label">Email</Form.Label>
          <Form.Control
            type="text"
            value={data.email}
            onChange={handleEmailChange}
            className={`form-control ${emailError ? "is-invalid" : ""}`}
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </Form.Group>
        <Form.Group controlId="formPassword" className="form-group">
          <Form.Label className="form-label">Password</Form.Label>
          <Form.Control
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="form-control"
          />
        </Form.Group>
        {error && <p className="error-message">{error}</p>}
        <Button
          variant="primary"
          type="submit"
          className="submit-button"
          disabled={data.email === "" || data.password === "" || emailError}
        >
          Register
        </Button>
      </Form>

      <Button
        variant="link"
        onClick={handleLoginRedirect}
        className="login-redirect-button"
      >
        Already have an account? Login
      </Button>
    </div>
  );
}

export default Register;
