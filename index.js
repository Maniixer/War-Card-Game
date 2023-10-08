const newDeck = document.getElementById("new-deck");
const drawCard = document.getElementById("draw-cards");
const cardWinner = document.getElementById("card-winner");
const remainingCards = document.getElementById("remaining-cards");
const playerScore = document.getElementById("player-score");
const computerScore = document.getElementById("computer-score");
let deckId = "";
let playerPoint = 0;
let computerPoint = 0;

newDeck.addEventListener("click", getNewDeckData);
drawCard.addEventListener("click", drawCards);

function getNewDeckData() {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
      deckId = data.deck_id;
      drawCard.disabled = false;
      remainingCards.textContent = `Cards Remaining: ${data.remaining}`;

      playerPoint = 0;
      computerPoint = 0;
      playerScore.textContent = `Player Score: ${playerPoint}`;
      computerScore.textContent = `Computer Score: ${computerPoint}`;
      cardWinner.textContent = "Game of War!";
    });
}

function drawCards() {
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then((resp) => resp.json())
    .then((data) => {
      if (data.remaining) {
        document.getElementById(
          "cards-container"
        ).children[0].innerHTML = `<div class="img"><img src="${data.cards[0].image}" alt="${data.cards[0].value} OF ${data.cards[0].suit}"></div>`;
        document.getElementById(
          "cards-container"
        ).children[1].innerHTML = `<div class="img"><img src="${data.cards[1].image}" alt="${data.cards[1].value} OF ${data.cards[1].suit}"></div>`;

        cardWinner.textContent = determineCardWinner(data.cards[0], data.cards[1]);
        remainingCards.textContent = `Cards Remaining: ${data.remaining}`;
      } else {
        remainingCards.textContent = `Cards Remaining: No more cards - Get a new deck!`;
        drawCard.disabled = true;

        if (playerPoint > computerPoint) {
          cardWinner.textContent = "You won the game!";
        } else if (playerPoint < computerPoint) {
          cardWinner.textContent = "The computer won the game!";
        } else {
          cardWinner.textContent = "It's a tie game!";
        }
      }
    });
}

function determineCardWinner(player, computer) {
  const cardsValueArray = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"];
  const playerValueIndex = cardsValueArray.indexOf(player.value);
  const computerValueIndex = cardsValueArray.indexOf(computer.value);

  if (playerValueIndex > computerValueIndex) {
    playerPoint++;
    playerScore.textContent = `Player Score: ${playerPoint}`;
    return "Player Wins!";
  } else if (playerValueIndex < computerValueIndex) {
    computerPoint++;
    computerScore.textContent = `Computer Score: ${computerPoint}`;
    return "Computer Wins!";
  } else {
    return "War!";
  }
}
