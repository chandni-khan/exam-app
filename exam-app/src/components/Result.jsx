import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Result() {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const location = useLocation();
  const result = location.state;

  if (!result) {
    return (
      <div>
        <h2>Oops! No exam result found</h2>
        <p>
          It looks like you haven't appeared for the exam yet. Please complete
          the exam to view your results.
        </p>
        <Button variant="link" onClick={() => navigate("/exam")}>
          Appear in exam first
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2>Exam Result</h2>
      <p>Total Questions: {result.totalQuestions}</p>
      <p>Correct Answers: {result.correctAnswers}</p>
      <p>
        Result: <strong>{result.result}</strong>
      </p>
      {result.result === "Pass" ? (
        <p>Congratulations on passing the exam! Keep up the great work.</p>
      ) : (
        <p>
          Don't worry, you can always try again! Review the questions and
          improve.
        </p>
      )}
      <Button onClick={() => navigate("/exam")}>Back to Exam</Button>
    </div>
  );
}
