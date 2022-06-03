/* Uses Case Statements */
// Airtable
const pw = localStorage.getItem("pw");
const key = "keyJLBdH3kt" + pw;
const app_id = "appUOVbjlWQtGuhQ2";
const base_url = `https://api.airtable.com/v0/${app_id}`;

// variables
// var name = "";
var scene1NoDB = roller;
var whichAttribute = 0; // Which one are we on?
var roll = -1;
var attribute = "Undefined";
/* Global Variables */
// attributes = attribute, current value
var attributes = [
  ["Strength", 0],
  ["Intelligence", 0],
  ["Wisdom", 0],
  ["Constitution", 0],
  ["Dexterity", 0],
  ["Charisma", 0],
];
// classReq = attributes[index], minimum value to qualify, classes[index]
var classReq = [
  [0, 13, 0],
  [1, 14, 1],
  [2, 9, 2],
  [3, 11, 3],
  [4, 10, 4],
  [5, 12, 5],
];
var classes = [
  ["Christian Bale", ["Batman Begins", "The Dark Night"], "One Punch Knockout"],
  ["Robert Pattinson", ["The Batman 2020"], "Knows All The Answers"],
  ["Michael Keaton", ["Batman 1989"], "Predicts Villain Behaviors"],
  ["Will Arnett", ["Lego Batman: The Movie"], "No Fall Damage"],
  ["Ben Affleck", ["Batman vs. Superman"], "Can Escape Any Room"],
  ["Kevin Conroy", ["Batman: The Killing Joke"], "Soul Catching Voice"],
];
var classList = []; // which classes can we pick?
var choices = []; // what are our scene choices?
var maxRolls = 3; // how many rerolls? Default = 3
var rollCount = 0; // which reroll are we on?
var modalText = "Houston, we have a problem defining modalText";
let classText = [];
var classImage = [
  "Bale.jpeg",
  "Pattinson.jpg",
  "Keaton.jpg",
  "Arnett.jpg",
  "Affleck.jpg",
  "Conroy.jpg",
];

function checkAnswersNoDB(answer, classSelection) {
  console.log("checkAnswersNoDB, classSelection =", classSelection);
  switch (answer) {
    case "Keep":
      keep();
      break;
    case "Reroll":
      reroll();
      break;
    case "See Stats":
      stats();
      break;
    case "Start Over":
      restart();
      break;
    default:
      // Store our selected class to local storage and close window.
      if (classSelection) {
        localStorage.setItem("charClass", answer);
        saveGameCharacter(answer);
      }
  }
}

function saveGameCharacter(answer) {
  const game_id = localStorage.getItem("game_id");
  let url = `${base_url}/gameProgress?api_key=${key}`;
  let type = "POST";

  if (localStorage.game_id) {
    url = `${base_url}/gameProgress/${game_id}?api_key=${key}`;
    type = "PATCH";
  }

  const OPENING_BATMAN_SCENE = "recIjdKteWhFUXz96";
  const progressData = {
    fields: {
      turnNumber: 1,
      currentScene: [OPENING_BATMAN_SCENE],
      character: `${answer} the Batman`,
      Class: answer,
      Strength: attributes[0][1],
      Intelligence: attributes[1][1],
      Wisdom: attributes[2][1],
      Constitution: attributes[3][1],
      Dexterity: attributes[4][1],
      Charisma: attributes[5][1],
      Au: 25,
      HP: 10,
      AC: 10,
    },
  };

  buttonElement.innerHTML = "Saving game...";
  $.ajax({ url, type, data: progressData })
    .done(function (data) {
      localStorage.removeItem("rollingChar");
      localStorage.setItem("game_id", data.id);
      window.close();
    })
    .fail(function (err) {
      console.log("saveGameCharacter(): ", err);
    });
}

function roller() {
  roll = random();
  attribute = attributes[whichAttribute][0];
  story("You rolled a " + roll + " for " + attribute + ".");
  choices = ["Keep", "Reroll"];
  answer = setOptionsNoDB(choices);
}

/* Function Keep
 * Pulls dice roll value from page to save in array.
 * Then rolls next attribute.
 * @param none
 * @return random integer 3 to 18
 */
function random() {
  let sum = 0;
  for (let roll = 1; roll <= 3; roll++) {
    let rolled = Math.floor(Math.random() * 6) + 1;
    sum += rolled;
  }
  return sum;
}

/* Function Keep
 * Pulls dice roll value from page to save in array.
 * Then rolls next attribute.
 * @param none
 * @return none
 */
function keep() {
  let add2Story = "Your " + attribute + " is now " + roll + ".\n<br>";
  attributes[whichAttribute][1] = roll;
  roll = random();
  if (whichAttribute < 5) {
    whichAttribute++;
    attribute = attributes[whichAttribute][0];
    add2Story += "You rolled a " + roll + " for " + attribute + ".";
    story(add2Story);
    choices = ["Keep", "Reroll"];
    answer = setOptionsNoDB(choices);
  } else {
    story("Your character rolls are complete.  Let's see what they were.");
    choices = ["See Stats", "Start Over"];
    answer = setOptionsNoDB(choices);
    // Store the attributes in local storage.
    for (let x = 0; x < attributes.length; x++) {
      localStorage.setItem(attributes[x][0], attributes[x][1]);
    }
  }
}

function reroll() {
  rollCount++;
  let rollsLeft = maxRolls - rollCount;
  if (rollsLeft < 1) {
    roll = random();
    story(
      "You rolled a " + roll + ". That was your last reroll.  Select KEEP."
    );
    choices = ["Keep", "No Rerolls Left"];
  } else if (rollsLeft < 0) {
    story(
      "Sorry, you're stuck with your" + roll + ". You have no rerolls left."
    );
    choices = ["Keep"];
  } else {
    roll = random();
    story(
      "You rolled a " +
        roll +
        " for " +
        attribute +
        ". You have " +
        rollsLeft +
        " rerolls left."
    );
    choices = ["Keep", "Reroll"];
  }
  answer = setOptionsNoDB(choices);
}

function reStart() {
  story("Sorry, you don't get to keep restarting until you get great rolls!");
  choices = ["Go into the forest", "Ignore it and go home"];
  answer = setOptionsNoDB(choices);
}

function stats() {
  story("Here are your stats.");
  let statsBox = document.getElementById("modalBox");
  let statsText = document.getElementById("modalText");
  statsText.innerHTML = "<h1>Your Character Stats</h1>";
  var statTable = document.createElement("table");
  var labels = statTable.insertRow();
  for (let thead = 0; thead < 6; thead++) {
    var th1 = document.createElement("th");
    th1.innerHTML = attributes[thead][0];
    labels.appendChild(th1);
  }
  var values = statTable.insertRow();
  for (let tcell = 0; tcell < 6; tcell++) {
    var Cell = values.insertCell();
    Cell.innerHTML = attributes[tcell][1];
  }
  statsText.appendChild(statTable);
  statsBox.style.display = "block";
  picker();
}

/* Function Class Options
 * @param none (attributes is global)
 * @return classList array
 * This function references a list of classes
 * And selects those that match the requirements
 * Based on the player's rolled attributes
 * attributes = attribute, current value
 * classReq = attributes[index], minimum value to qualify, classes[index]
 */
function classOptions() {
  classList = [];
  for (let att6 = 0; att6 < attributes.length; att6++) {
    if (attributes[att6][1] >= classReq[att6][1]) {
      /* classList.push(classes[classReq[att6][2]][0]); */
      classList.push(att6);
    }
  }
  return classList;
}

function picker() {
  classList = classOptions();
  let classData = getClassData(classList);
  let addStory =
    'Which Batman shall you be?  Here are your options based on your rolls:<br><ul style="text-align:left;">';
  for (let choice = 0; choice < classData.length; choice++) {
    modalText = classDescription(classList[choice]);
    classText.push(modalText);
    addStory +=
      "<li> " +
      classes[classList[choice]][0] +
      ': <button onclick="showModal(classText[' +
      choice +
      ']);">About</button>';
  }
  addStory += "</ul>";
  story(addStory);
  choices = getClassData(classList, 0);
  answer = setOptionsNoDB(choices);
}

function classDescription(classID) {
  let classDesc = "Name: " + classes[parseInt(classID)][0] + " <br>";
  classDesc +=
    "Batman Movies: " + classes[parseInt(classID)][1].toString() + " <br>";
  classDesc += "<img src=" + classImage[classID] + "><br>";
  classDesc += "<button onclick = 'hideModal()'>close</button>";
  return classDesc;
}

function getClassData(array1, field) {
  let classData = [];
  if (typeof field === "undefined") {
    for (let option = 0; option < array1.length; option++) {
      classData.push(classes[array1[option]]);
    }
  } else {
    for (let option = 0; option < array1.length; option++) {
      classData.push(classes[array1[option]][field]);
    }
  }
  return classData;
}
