/* Canonical checkAnswer */
function checkAnswers(answer) {
  switch (answer) {
    case "Reroll":
      reroll();
      break;
    case "See Stats and Pick Character":
      stats();
      break;
    case "Start Over":
      restart();
      break;
    case "Just let me see the stats":
      stats();
      break;
    case "Restart Anyways":
      stats();
      break;
    case "Christian Bale":
      toMelee();
      break;
    case "Ben Affleck":
      toMelee();
      break;
    case "Kevin Conroy":
      toMelee();
      break;
    case "Will Arnett":
      toMelee();
      break;
    case "Robert Pattinson":
      toMelee();
      break;
    case "Michael Keaton":
      toMelee();
      break;
    case "Confront Him":
      determineInitiative();
      break;
    case "Move":
      move();
      break;
    case "Move + Attack":
      //moveAttack();
      pcAttack(1);
      break;
    case "Attack":
      attack();
      break;
    case "Special":
      special();
      break;
    case "Run Away":
      runAway();
      break;
    case "Wait and then Attack":
      wait();
      break;
    case "Ask Robin":
      robinJoker();
      break;
    case "Use First-Aid Kit: (" + inventory[0][1][1] + " Remaining)":
      heal();
      break;
    case "Ok":
      turnChange();
      break;
    case "Punch":
      pcAttack(0);
      break;
    case "Done":
      endMeleeAndSave();
      break;
    default:
      attackId(answer);
  }
}
