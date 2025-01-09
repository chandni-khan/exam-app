import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import "../css/CreateQuestion.css";

export default function CreateQuestions() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate inputs
    if (!question) {
      setError("Question is required.");
      return;
    }

    if (options.some((option) => option.trim() === "")) {
      setError("All options must be filled.");
      return;
    }

    if (correctAnswer === null) {
      setError("Please select the correct option.");
      return;
    }

    const questionPayload = {
      questionText: question,
      options,
      correctAnswer,
    };
let token=localStorage.getItem("token");
    try {
      // Send request to backend
      const response = await axios.post(
        "http://localhost:8080/api/questions",
        questionPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);
      setSuccessMessage("Question created successfully!");
      setQuestion("");
      setOptions(["", ""]);
      setCorrectAnswer(null);
    } catch (err) {
      console.error("Error creating question:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create the question. Please try again."
      );
    }
  };

  return (
    <Container className="create-questions-container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">
            Create a Multiple-Choice Question
          </h2>

          <Form onSubmit={handleSubmit} className="question-form">

            {/* Question Field */}
            <Form.Group controlId="formQuestion" className="mb-4">
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question"
                className="form-control"
              />
            </Form.Group>

            {/* Options Fields */}
            {options.map((option, index) => (
              <Form.Group
                key={index}
                controlId={`formOption${index}`}
                className="mb-3"
              >
                <Form.Label>Option {index + 1}</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Enter option ${index + 1}`}
                    className="me-3"
                  />
                  <Form.Check
                    type="radio"
                    name="correctAnswer"
                    label="Correct"
                    checked={correctAnswer === index}
                    onChange={() => setCorrectAnswer(index)}
                    className="radio-button"
                  />
                </div>
              </Form.Group>
            ))}

            {/* Add Option Button */}
            <div className="text-center">
              <Button
                variant="secondary"
                onClick={handleAddOption}
                className="mb-4"
              >
                Add Another Option
              </Button>
            </div>

            {/* Error Message */}
            {error && <p className="text-danger text-center">{error}</p>}

            {/* Success Message */}
            {successMessage && (
              <p className="text-success text-center">{successMessage}</p>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <Button variant="primary" type="submit" className="w-50">
                Submit Question
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
