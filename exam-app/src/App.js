import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap"; // Import Bootstrap components
import Login from "./components/Login";
import Register from "./components/Register";
import ExamQuestion from "./components/Exams";
import Result from "./components/Result";
import CreateQuestions from "./components/CreateQuestions";
import AppNavbar from "./components/AppNavbar";

// ProtectedRoute Component
function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || userRole !== roleRequired) {
    // Redirect to login if no token or incorrect role
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <AppNavbar />
      <Container style={{ marginTop: "3rem" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exam" element={<ExamQuestion />} />
          <Route
            path="/createQuestion"
            element={
              <ProtectedRoute roleRequired="admin">
                <CreateQuestions />
              </ProtectedRoute>
            }
          />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Container>
    </Router>
  );
}
