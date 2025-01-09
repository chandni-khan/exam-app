const Question = require("../models/question");
const User = require("../models/user");
const { validationResult } = require("express-validator");

const createQuestion = async (req, res) => {
  const { options, questionText, correctAnswer } = req.body;
console.log("___________req.body", req.body);
  if (
    !questionText ||
    !options ||
    !Array.isArray(options) ||
    options.length === 0
  ) {
    return res.status(400).json({ message: "Invalid exam data" });
  }

  try {
    const question = new Question({ options, questionText, correctAnswer });
    await question.save();
    res.status(201).json({ message: "Exam created successfully.", question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating the exam" });
  }
};



const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching questions" });
  }
};



const submitExam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { answers } = req.body; 

  try {
    let correctAnswers = 0;
    const results = [];

    // Loop through each answer and check if it's correct
    for (const answer of answers) {
      const question = await Question.findById(answer.questionId); 
      if (!question) {
        return res
          .status(404)
          .json({ message: `Question with ID ${answer.questionId} not found` });
      }

      // Check if the selected answer is correct
      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) {
        correctAnswers++;
      }

      // Store the result for each question
      results.push({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      });
    }

    // Calculate the result (Pass or Fail)
    const totalQuestions = answers.length;
    const resultStatus =
      correctAnswers / totalQuestions >= 0.5 ? "Pass" : "Fail";

    const result = {
      totalQuestions,
      correctAnswers,
      result: resultStatus,
      details: results, 
    };

    // Send the result to the client
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while submitting the exam" });
  }
};



module.exports = { createQuestion, getQuestions, submitExam };
