import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        data
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      if (response.data.role === "admin") {
        navigate("/createQuestion");
      } else {
        navigate("/exam");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="app-info">
        <h1 className="app-title">Welcome Back to APPGENIX QuizMaster!</h1>
        <p className="app-description">
          APPGENIX QuizMaster is your go-to platform for interactive
          multiple-choice quizzes.
          <strong>
            Don't have an account yet? Register now to get started!
          </strong>
        </p>
      </div>
      <h2 className="login-heading">Login</h2>
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Group controlId="formEmail" className="form-group">
          <Form.Label className="form-label">Email</Form.Label>
          <Form.Control
            type="text"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="form-control"
          />
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
          disabled={data.email === "" || data.password === ""}
        >
          Login
        </Button>
      </Form>

      <Button
        variant="link"
        onClick={handleRegisterRedirect}
        className="register-button"
      >
        Don't have an account? Register
      </Button>
    </div>
  );
}

export default Login;
