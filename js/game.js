import formatData from "./helper.js";

const level = localStorage.getItem("level") || "mediun";

const loader = document.getElementById("loader");
const container = document.getElementById("container");
const questionText = document.getElementById("question-text");
const scoreText = document.getElementById("score");
const nextButton = document.getElementById("next-button");
const questionNumber = document.getElementById("question-number");
const finishButton = document.getElementById("finish-button");
const errors = document.getElementById("error");

const answerList = document.querySelectorAll(".answer-text");

const CORRECT_BONUS = 10;
const URL = `https://opentdb.com/api.php?amount=10&difficulty=${level}&type=multiple`;

let formattedData = null;
let questionIndex = 0;
let correctAnswer = null;
let score = 0;
let isAccepted = true;

const fetchData = async () => {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    formattedData = formatData(data.results);

    startGame();
  } catch (error) {
    loader.style.display = "none";
    errors.style.display = "block";
  }
};

const startGame = () => {
  showQuestion();
  loader.style.display = "none";
  container.style.display = "block";
};

const showQuestion = () => {
  questionNumber.innerText = questionIndex + 1;

  const { question, answers, correctAnswerIndex } =
    formattedData[questionIndex];
  correctAnswer = correctAnswerIndex;
  console.log(correctAnswer);

  questionText.innerText = question;

  answerList.forEach((answer, index) => {
    answer.innerText = answers[index];
  });
};

const checkAnswer = (event, index) => {
  if (!isAccepted) return;

  isAccepted = false;
  const isCorrect = index === correctAnswer ? true : false;

  if (isCorrect) {
    event.target.classList.add("correct");

    score += CORRECT_BONUS;
    scoreText.innerText = score;
  } else {
    event.target.classList.add("incorrect");

    answerList[correctAnswer].classList.add("correct");
  }
};

const nextHandler = () => {
  if (questionIndex < formattedData.length - 1) {
    questionIndex++;
    isAccepted = true;
    removeClasses();
    showQuestion();
  } else {
    finishHandler();
  }
};

const removeClasses = () => {
  answerList.forEach((answer) => {
    answer.className = "answer-text";
  });
};

const finishHandler = () => {
  localStorage.setItem("score", JSON.stringify(score));
  window.location = "end.html";
};

window.addEventListener("load", fetchData);
nextButton.addEventListener("click", nextHandler);

finishButton.addEventListener("click", finishHandler);

answerList.forEach((answer, index) => {
  answer.addEventListener("click", (event) => checkAnswer(event, index));
});
