/* global variables */
var questionDiv = document.getElementById("question");
var choicesDiv = document.getElementById("choices");
var questionBtn = document.getElementById("questionBtn");
var finishBtn = document.getElementById("finishBtn");
var viewHighScore = document.getElementById("viewHighScore");
var startQuiz = document.getElementById("startQuiz");
var starter = document.getElementById("starter");
var timerText = document.getElementById("timer");
var pause = document.getElementById("pause");
var yourScore = document.getElementById("score");
var display = document.getElementById("display");
var showScore = document.getElementById("showScore");
var username = document.getElementById("userName");
var saveBtn = document.getElementById("saveBtn");
var mostRecentScore = localStorage.getItem("mostRecentScore");
var finalScore = document.getElementById("finalScore");
var finalNumberCorrect = document.getElementById("finalNumberCorrect");
var highScoresOne = document.getElementById("highScores");
var scoreInput = document.getElementById("scoreInput");
var startTime = document.getElementById("startTime");
var numberCorrect = 0;
var startQuestion = 0;

/* helpers */

/* takes in index, uses that index to find question in db to return the title */
function renderQuestion(index) {
  if (startQuestion < questions.length) {
    return questions[index].title;
  } else {
    return;
  }
}
/* takes in index, uses this index to return the choices from the db */
function renderChoices(index) {
  choicesDiv.innerHTML = "";
  for (i = 0; i < questions[index].choices.length; i++) {
    //var choiceBtn = document.createElement('button');
    var choiceBtn = document.createElement("input");
    choiceBtn.setAttribute("type", "radio");

    choiceBtn.setAttribute("class", "answers");
    choiceBtn.setAttribute("value", questions[index].choices[i]);
    var label = document.createElement("label");
    label.appendChild(choiceBtn);
    label.innerHTML += "<span> " + questions[index].choices[i] + "</span><br>";
    //--we add the label to the form.

    //var choiceBtn = "<div class='input-group'><div class='input-group-prepend'><div class='input-group-text'><input type='radio' name='answers' value="+questions[index].choices[i]+">"+questions[index].choices[i]+"</div></div></div><br/>";
    /*var radios = document.getElementsByName('answers');
            radios[i].checked)*/

    //choiceBtn.textContent = questions[index].choices[i];
    choicesDiv.appendChild(label);
  }
}

/*remove start quiz button*/

function deleteStart() {
  var child = starter.lastElementChild;
  starter.removeChild(child);
}

/*timer*/
var secondsLeft = 106;

function setTime() {
  var timerInterval = setInterval(function() {
    secondsLeft--;
    timerText.textContent = secondsLeft + " seconds remaining.";

    if (secondsLeft === 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
}

/* shore score */
function scoreDisplay() {
  //var choiceBtn = "<input type='radio' name='answers' value="+questions[index].choices[i]+">"+questions[index].choices[i]+"<br/>";
  /*var radios = document.getElementsByName('answers');
            radios[i].checked)*/
  // grab this value and see if it is equal to the actual answer, compare them and see if they are equal and increment score by one

  yourScore.innerHTML = "You have gotten: " + numberCorrect + " correct.";
}

/* update score when answer correct*/

/*store score*/

/* events */
questionBtn.addEventListener("click", function() {
  startTime.innerHTML = "";
  var parent = this.parentNode;
  console.log(this.parentNode);
  var answers = parent.querySelectorAll(".answers");
  for (i = 0; i < answers.length; i++) {
    //console.log(answers[i].checked)
    if (
      answers[i].checked === true &&
      answers[i].value === questions[startQuestion - 1].answer
    ) {
      numberCorrect++;
      console.log(numberCorrect);
      scoreDisplay();
    }
    if (startQuestion === questions.length) {
      questionBtn.textContent = "Finish";
      showScore.style.display = "block";
      finalScore.textContent = parseInt(secondsLeft + numberCorrect);
      display.innerHTML = "";
      finalNumberCorrect.innerHTML = numberCorrect;
    } else {
      questionBtn.textContent = "Next";
    }
  }

  /* call redner question */
  questionDiv.innerHTML = renderQuestion(startQuestion);
  renderChoices(startQuestion);
  startQuestion++;

  if (startQuestion === questions.length) {
    finishBtn.style.display = "block";
    questionBtn.style.display = "block";
  } else {
    finishBtn.style.display = "none";
    questionBtn.style.display = "block";
  }
});

finishBtn.addEventListener("click", function() {});

/* init */

finishBtn.style.display = "none";
questionBtn.style.display = "none";
showScore.style.display = "none";
startTime.innerHTML = "You have 105 seconds remaining.";

startQuiz.addEventListener("click", function() {
  startTime.innerHTML = "";
  questionBtn.textContent = "Next";
  showScore.style.display = "none";
  setTime();
  scoreDisplay();
  questionBtn.style.display = "block";
  deleteStart();
  renderChoices(0);
  questionDiv.innerHTML = renderQuestion(startQuestion);
  startQuestion++;
});

var highScoresArray = [];

scoresInit();

function renderHighScores() {
  highScoresOne.innerHTML = "";

  for (var i = 0; i < highScoresArray.length; i++) {
    var highScore = highScoresArray[i];

    var li = document.createElement("li");
    li.textContent = highScore;
    li.setAttribute("data-index", i);

    highScoresOne.appendChild(li);
  }
}

//

function scoresInit() {
  // Get stored scores from localStorage
  // Parsing the JSON string to an object
  var storedScores = JSON.parse(localStorage.getItem("highScoresArray"));

  // If scores were retrieved from localStorage, update the scores array to it
  if (storedScores !== null) {
    highScoresArray = storedScores;
  }

  // Render scores to the DOM
  renderHighScores();
}

function storeScores() {
  // Stringify and set high scores key in localStorage to high scores array
  localStorage.setItem("highScoresArray", JSON.stringify(highScoresArray));
}

saveBtn.addEventListener("click", function(event) {
  event.preventDefault();

  var scoreText = (scoreInput.value + " " + finalScore.innerHTML).trim();

  // Return from function early if submitted text is blank
  if (scoreText === "") {
    return;
  }

  highScoresArray.push(scoreText);
  scoreInput.value = "";

  // Store updated high scores in localStorage, re-render the list
  storeScores();
  renderHighScores();
});
