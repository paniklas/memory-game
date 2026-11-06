const symbols = ["🍎", "🚀", "🐱", "🎵", "🌈", "⚽"];
const board = document.querySelector("#board");
const movesDisplay = document.querySelector("#moves");
const statusDisplay = document.querySelector("#status");
const restartButton = document.querySelector("#restart");
 
const gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    isLocked: false,
    isGameOver: false
};
 
function shuffle(items) {
    const shuffled = [...items];
 
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
 
    return shuffled;
}
 
function createCards() {
    const pairs = [...symbols, ...symbols];
    
    return shuffle(pairs).map((symbol, index) => ({
        id: index,
        symbol,
        isMatched: false
    }));
}

function renderCards() {
    board.innerHTML = "";
    
    gameState.cards.forEach((card) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "card";
        button.textContent = "?";
        button.setAttribute("aria-label", "Hidden card");
        button.dataset.id = card.id;
    
        button.addEventListener("click", () => handleCardClick(card.id));
    
        board.appendChild(button);
    });
}
 
function updateMoves() {
  movesDisplay.textContent = gameState.moves;
}

function updateStatus(message) {
  statusDisplay.textContent = message;
}
 
function revealCard(cardId) {
  const card = gameState.cards.find((item) => item.id === cardId);
  const button = board.querySelector(`[data-id="${cardId}"]`);
 
  button.textContent = card.symbol;
  button.classList.add("is-revealed");
  button.setAttribute("aria-label", `Revealed ${card.symbol}`);
  gameState.flippedCards.push(card);
}
 
function hideCard(card) {
  const button = board.querySelector(`[data-id="${card.id}"]`);
 
  button.textContent = "?";
  button.classList.remove("is-revealed");
  button.setAttribute("aria-label", "Hidden card");
}
 
function handleCardClick(cardId) {
    if (gameState.isLocked || gameState.isGameOver) return;
 
    const card = gameState.cards.find((item) => item.id === cardId);
 
    if (card.isMatched) return;
    if (gameState.flippedCards.some((item) => item.id === cardId)) return;
 
    revealCard(cardId);
 
    if (gameState.flippedCards.length !== 2) return;
 
    gameState.moves++;
    updateMoves();
 
    const [firstCard, secondCard] = gameState.flippedCards;
 
    if (firstCard.symbol === secondCard.symbol) {
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        gameState.matchedPairs++;
 
    const firstButton = board.querySelector(`[data-id="${firstCard.id}"]`);
    const secondButton = board.querySelector(`[data-id="${secondCard.id}"]`);
 
    firstButton.classList.add("is-matched");
    secondButton.classList.add("is-matched");
    firstButton.disabled = true;
    secondButton.disabled = true;
 
    gameState.flippedCards = [];
    updateStatus("Match found!");
 
    if (gameState.matchedPairs === symbols.length) {
      gameState.isGameOver = true;
      updateStatus(`You won in ${gameState.moves} moves!`);
    }
  } else {
    gameState.isLocked = true;
    updateStatus("Not a match. Try again.");
 
    setTimeout(() => {
      gameState.flippedCards.forEach(hideCard);
      gameState.flippedCards = [];
      gameState.isLocked = false;
      updateStatus("Choose two cards.");
    }, 900);
  }
}

function startGame() {
  gameState.cards = createCards();
  gameState.flippedCards = [];
  gameState.matchedPairs = 0;
  gameState.moves = 0;
  gameState.isLocked = false;
  gameState.isGameOver = false;
 
  updateMoves();
  updateStatus("Choose any card to begin.");
  renderCards();
}

restartButton.addEventListener("click", startGame);

startGame();