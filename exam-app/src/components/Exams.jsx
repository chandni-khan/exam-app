import React, { useState, useEffect } from "react";
import { Button, Container, Card, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ExamQuestion() {
  const [exam, setExam] = useState([]); 
  const [answers, setAnswers] = useState([]); 
 const navigate = useNavigate();
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/questions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setExam(response.data);
        setAnswers(new Array(response.data.length).fill(null)); // Initialize answers with null
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };
    fetchExam();
  }, []);

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(e.target.value); // Store the index of selected answer
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      if (answers.includes(null)) {
        alert("Please answer all questions before submitting!");
        return;
      }

      // Prepare an array of objects containing questionId and selected answer
      const answersWithQuestionId = exam.map((q, index) => ({
        questionId: q._id,
        selectedAnswer: answers[index], // Store the index of the selected option
      }));

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/questions/submit",
        { answers: answersWithQuestionId }, // Send the array with questionId and selectedAnswer
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
        const resultData = {
          totalQuestions: response.data.totalQuestions,
          correctAnswers: response.data.correctAnswers,
          result: response.data.result,
        };
        navigate("/result", { state: resultData });
      alert(
        `Result: ${response.data.result} (${response.data.correctAnswers} correct answers out of ${response.data.totalQuestions})`
      );
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  if (exam.length === 0) return <p>Loading...</p>;

  return (
    <Container style={{ marginTop: "2rem" }}>
      <h2 className="text-center mb-4">Exam Questions</h2>
      {exam.map((q, index) => (
        <Card key={q._id} className="mb-3">
          <Card.Body>
            <Card.Title>Question {index + 1}</Card.Title>
            <Card.Text>{q.questionText}</Card.Text>
            <Form>
              {q.options.map((option, i) => (
                <Form.Check
                  type="radio"
                  id={`question-${index}-option-${i}`}
                  name={`question-${index}`}
                  label={option}
                  value={i} // Set the index of the option as the value
                  key={i}
                  onChange={(e) => handleAnswerChange(e, index)}
                  checked={answers[index] === i} // Check if this option is selected
                />
              ))}
            </Form>
          </Card.Body>
        </Card>
      ))}
      <div className="text-center">
        <Button onClick={handleSubmit} variant="primary">
          Submit
        </Button>
      </div>
    </Container>
  );
}

export default ExamQuestion;
