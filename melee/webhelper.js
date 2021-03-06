// var options = [];  Not in RPG Version
var buttonElement = document.getElementById("button1");
var currentStoryElement = document.getElementById("currentStory");
var dropdown = document.getElementById("choices");
var messages = [];
var choices;
var answer;
var hasImage = false;
var textTimer;
var optionFlags = {}; // Hmmm... what's this?

function start() {
  setup();
  scene1();
}

function startNoDB() {
  setupNoDB();
}

// Track in-game progress for saves.
var gameProgress = {
  id: null,
  character: null,
  currentScene: null,
  gold: 25,
  hitPoints: 10,
  flags: [],
  turnNumber: 0,
};

var config = {
  START_GAME: "START_GAME",
  SELECT_CHARACTER: "SELECT_CHARACTER",
  PLAY_GAME: "PLAY_GAME",
  GAME_OVER: "GAME_OVER",
  OPTION_NEW_GAME: "OPTION_NEW_GAME",
  OPTION_SAVE_GAME: "OPTION_SAVE_GAME",
};

// Track game state and keep information pulled from Airtable that we don't
// want to have to request again later.
var gameData = {
  currentGameState: config.START_GAME,
  optionFlags: [],
  characters: [],
  savedGames: {},
  touchedSinceSave: false,
};

// This will return false if the character does not have the required flag
// for a choice or if the character has the blocking flag for the choise.
// Otherwise it will return true.
function optionIsVisible(requiredFlags, blockingFlags) {
  if (requiredFlags) {
    for (let idx = 0; idx < requiredFlags.length; idx++) {
      if (!gameProgress.flags.includes(requiredFlags[idx])) {
        return false;
      }
    }
  }
  if (blockingFlags) {
    for (let idx = 0; idx < blockingFlags.length; idx++) {
      if (gameProgress.flags.includes(blockingFlags[idx])) {
        return false;
      }
    }
  }
  return true;
}

// Use game state to determine how to handle the button click.
function handleClick() {
  switch (gameData.currentGameState) {
    case config.START_GAME:
      getNewOrSavedStory(dropdown.value);
      break;
    case config.SELECT_CHARACTER:
      getCharacterSelection(dropdown.value);
      break;
    default:
      if (dropdown.value === config.OPTION_SAVE_GAME) {
        saveGame();
      } else {
        getScene(dropdown.value);
      }
  }
}

function addOptionFlag(target, flag) {
  optionFlags[target] = flag;
}

function clearOptionFlags() {
  Object.keys(optionFlags).forEach(function (key) {
    delete optionFlags[key];
  });
}

function start() {
  setup();
  scene1();
}

function startNoDB() {
  setupNoDB();
}

/* function setup() {
    setOptions([{ choice: "No DB", target: "" }]);
    buttonElement.innerHTML = "Choose One.";
    buttonElement.onclick = function () {
      getScene(dropdown.value);
    }
}*/

function setup() {
  setOptions([{ choice: "", target: "" }]);
  buttonElement.innerHTML = "Choose One.";
  buttonElement.addEventListener("click", handleClick);
  // .setAttribute("onclick", "getScene(dropdown.value)");
}

/* function setOptions(options) {
    let dropdown = document.getElementById("choices");
    while (dropdown.options.length) {
        dropdown.remove(0);
    }
    for (let i = 0; i < options.length; i++) {
    // This is object-oriented JavaScript (hence capital letter)
        let option = new Option(options[i].choice, options[i].target);
        dropdown.options.add(option);
    }
} */

function setOptions(options) {
  var dropdown = document.getElementById("choices");
  while (dropdown.options.length) {
    dropdown.remove(0);
  }
  if (options) {
    for (var i = 0; i < options.length; i++) {
      // This is object-oriented JavaScript (hence capital letter)
      var option = new Option(options[i].choice, options[i].target);
      dropdown.options.add(option);
      if (options[i].flag) {
        addOptionFlag(options[i].target, options[i].flag);
      }
    }
    appendGameOptions();
  } else {
    buttonElement.innerHTML = "The End";
    buttonElement.setAttribute("disabled", "true");
  }
}
function appendGameOptions() {
  let option;
  if (playingGame() && gameData.touchedSinceSave) {
    option = new Option("* Save Game", "OPTION_SAVE_GAME");
    dropdown.options.add(option);
  }
}

function playingGame() {
  return gameData.currentGameState === config.PLAY_GAME;
}

function getCharacterName(character) {
  return character.split(" ")[0];
}

/* NEW Display Story */
//function displayStory(text) {
//currentStoryElement.innerHTML = text;
//}

function displayStory(text, delay = false, append = false) {
  let currentStoryElement = document.getElementById("currentStory");
  if (typeof text === "string") {
    currentStoryElement.innerHTML = text;
  }
  // the following makes text reveal slowly if a delay is indicated in the database
  else if (delay) {
    // Disable the button to prevent making a selection before
    // full message is delivered.
    buttonElement.disabled = true;
    // Keep shifting strings from the array until it is empty.
    if (append) {
      currentStoryElement.innerHTML += `<br /><br />${text.shift()}`;
    } else {
      currentStoryElement.innerHTML = text.shift();
    }
    if (text.length) {
      setTimeout(function () {
        displayStory(text, delay, true);
      }, delay);
    } else {
      // Done. Re-enable button.
      buttonElement.disabled = false;
    }
  } else {
    currentStoryElement.innerHTML = text.join("<br /><br />");
  }
}

function showModal(htmlData) {
  let statsBox = document.getElementById("modalBox");
  let statsText = document.getElementById("modal-content");
  statsText.innerHTML = htmlData;
  statsBox.style.display = "block";
}

function hideModal() {
  let statsBox = document.getElementById("modalBox");
  statsBox.style.display = "none";
}

function addImage(imageURL) {
  let image = document.createElement("img");
  image.src = imageURL;
  image.setAttribute("width", "400px");
  let storyBox = document.getElementById("storybox");
  if (hasImage == true) {
    storyBox.innerHTML = "";
  }
  storyBox.style.textAlign = "center";
  storyBox.appendChild(image);
  hasImage = true;
}

function setupNoDB() {
  story("Game Loading");
  options = ["testing 1", "test 2", "test3"];
  setOptionsNoDB(options);
  buttonElement.innerHTML = "Pick One!";
  buttonElement.setAttribute("onclick", "checkAnswersNoDB(dropdown.value)");
  scene1NoDB();
}

function setOptionsNoDB(options) {
  let dropdown = document.getElementById("choices");
  while (dropdown.options.length) {
    dropdown.remove(0);
  }
  for (let i = 0; i < options.length; i++) {
    let option = new Option(options[i]);
    dropdown.options.add(option);
  }
}

function story(text) {
  currentStoryElement.innerHTML = text;
}

function delayText(text, delay) {
  let index = 0;
  story("");
  let callback = function (text) {
    story(currentStoryElement.innerHTML + text[index] + "<br />" + "<br />");
    index += 1;
    if (index > text.length - 1) {
      clearInterval(timer);
    }
  };
  let timer = setInterval(function () {
    callback(text);
  }, delay);
}
