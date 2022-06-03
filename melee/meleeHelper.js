window.onload = start;
//This right now is a copy of webhelper.js, nothing has changed yet. Will update Notes.txt when updated. 
var options=[];
var buttonElement = document.getElementById("button1");
var currentStoryElement = document.getElementById("currentStory");
var dropdown = document.getElementById("choices");
var messages = [];
/* mbm there is a choice array */
//var choices;

var answer;
var hasImage = false;

/* mbm This is not in later version */
//function start() {
//  setup();
//}

const meleeGameProgress = {};
const resultTargets = {
  victorious: null,
  defeated: null,
  flee: null,
  enemyFlee: null,
};

function start() {
  const game_id = localStorage.getItem("game_id");
  const melee_id = localStorage.getItem("melee_id");
  const requests = [
    $.ajax({ url: `${base_url}/gameProgress/${game_id}?api_key=${key}` }),
    $.ajax({ url: `${base_url}/melee/${melee_id}?api_key=${key}` }),
  ];

  Promise.all(requests)
    .then(function (data) {
      const progressData = data[0].fields;
      meleeGameProgress.character = progressData.character;
      meleeGameProgress.gold = parseInt(progressData.Au);
      meleeGameProgress.hitPoints = parseInt(progressData.HP);
      meleeGameProgress.AC = parseInt(progressData.AC);
      console.log("meleeGameProgress", meleeGameProgress);
      resultTargets.victorious = data[1].fields.victorious;
      resultTargets.defeated = data[1].fields.defeated;
      resultTargets.flee = data[1].fields.flee;
      resultTargets.enemyFlee = data[1].fields.enemyFlee;
      setup(data[1].fields.story);
    })
    .catch(function (err) {
      console.log("start() ajax:", err);
    });
}


function addImage(imageURL){
  let image = document.createElement("img");
  image.src = imageURL;
  image.setAttribute("width", "400px");
  var storyBox = document.getElementById("storybox");
  if (hasImage == true) {
      storyBox.innerHTML="";
  }
  storyBox.style.textAlign = "center";
  storyBox.appendChild(image);
  hasImage = true;
}

/* mbm this version does not take an argument *./
/* function setup() {
  * story("You are on the top of Gotham Funland and you see the Joker planning something.");
  * options=["Confront Him", "~Wait and then Attack", "~Ask Robin"];
  * setOptions(options); 
  * buttonElement.innerHTML = "What will you do?"; 
  * buttonElement.setAttribute("onclick", "checkAnswers(dropdown.value)");
  *}
*/

function setup(storyText) {
  story(storyText);
  options = ["Confront Him", "~Wait and then Attack", "~Ask Robin"];
  setOptions(options);
  buttonElement.innerHTML = "What will you do?";
  buttonElement.setAttribute("onclick", "checkAnswers(dropdown.value)");
}

function setOptions(options) {
  while (dropdown.options.length) {
    dropdown.remove(0);
  }
  for (var i = 0; i < options.length; i++) {
    var option = new Option(options[i]);
    dropdown.options.add(option);
  }
}

function story(text) {
  currentStoryElement.innerHTML = text;
}

function delayText(text, delay) {
  var index = 0;
  story("");
  var callback = function (text) {
    story(currentStoryElement.innerHTML  + text[index]+ "<br />"+ "<br />");
    index += 1;
    if (index >text.length-1){
      clearInterval(timer);
    }
  }
  var timer = setInterval(function () {
    callback(text);
  }, delay);
}


function showModal(htmlData){
  let statsBox = document.getElementById("modalBox");
  let statsText = document.getElementById("modal-content");
  statsText.innerHTML = htmlData;
  statsBox.style.display = "block";
}

function hideModal() {
  let statsBox = document.getElementById("modalBox");
  statsBox.style.display = "none";
}