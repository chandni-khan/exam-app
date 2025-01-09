const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createQuestion,
  getQuestions,
  submitExam,
} = require("../controllers/questionController");
const router = express.Router();

router.post("/", authMiddleware, createQuestion);
router.get("/", authMiddleware, getQuestions);
router.post("/submit", authMiddleware, submitExam);

module.exports = router;
