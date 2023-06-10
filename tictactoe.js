let playerTurn = true;
let computerMoveTimeout = 0;

const gameStatus = {
	MORE_MOVES_LEFT: 1,
	HUMAN_WINS: 2,
	COMPUTER_WINS: 3,
	DRAW_GAME: 4
};

window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
	// Setup the click event for the "New game" button
	const newBtn = document.getElementById("newGameButton");
	newBtn.addEventListener("click", newGame);

	// Create click-event handlers for each game board button
	const buttons = getGameBoardButtons();
	for (let button of buttons) {
		button.addEventListener("click", function () { boardButtonClicked(button); });
	}

	// Clear the board
	newGame();
}

// Returns an array of 9 <button> elements that make up the game board. The first 3 
// elements are the top row, the next 3 the middle row, and the last 3 the 
// bottom row. 
function getGameBoardButtons() {
	return document.querySelectorAll("#gameBoard > button");
}

function checkForWinner() {
	
	const buttons = getGameBoardButtons();

	// Ways to win
	const possibilities = [
		[0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
		[0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
		[0, 4, 8], [2, 4, 6] // diagonals
	];

	// Check for a winner first
	for (let indices of possibilities) {
		if (buttons[indices[0]].innerHTML !== "" &&
			buttons[indices[0]].innerHTML === buttons[indices[1]].innerHTML &&
			buttons[indices[1]].innerHTML === buttons[indices[2]].innerHTML) {
			
			// Found a winner
			if (buttons[indices[0]].innerHTML === "X") {
				return gameStatus.HUMAN_WINS;
			}
			else {
				return gameStatus.COMPUTER_WINS;
			}
		}
	}

	// See if any more moves are left
	let foundEmpty = false;
	for (let button of buttons) {
		if (button.innerHTML !== "X" && button.innerHTML !== "O") {
			return gameStatus.MORE_MOVES_LEFT;
		}
	}

	// If no winner and no moves left, then it's a draw
	return gameStatus.DRAW_GAME;
}

function newGame() {
	// reset computer move timeout
	clearTimeout(computerMoveTimeout);
	computerMoveTimeout = 0;

	// reset each square
	const buttons = getGameBoardButtons();
	for(let button of buttons) {
		// reset the buttons to be blank
		button.innerHTML = "";

		// remove disabled attribute and any class names if they're present
		if(button.hasAttribute("disabled")) {
			button.removeAttribute("disabled");
		}

		if(button.classList.contains("x")) {
			button.classList.remove("x");
			button.removeAttribute("class");
		}

		if(button.classList.contains("o")) {
			button.classList.remove("o");
			button.removeAttribute("class");
		}
		
		
	}

	// set playerTurn to true
	playerTurn = true;

	// set text of turn paragraph to "Your Turn"
	document.querySelector("#turnInfo").innerHTML = "Your turn";
}

function boardButtonClicked(button) {
	// if playerTurn is true
	if(playerTurn === true) {
		// set button's inner html to "X"
		button.innerHTML = "X";

		// add a "x" class to the button
		button.classList.add("x");

		// if the button doesn't have the disable attribute, add it
		button.setAttribute("disabled", " ");

		// call switch turn
		switchTurn();
		
	}
	
}

function switchTurn() {
	// check to see if the game has ended or not
	const gameStatus = checkForWinner();
	const buttons = getGameBoardButtons();

	// if there are moves left, continue playing
	if(gameStatus === 1) {
		// if player just did turn
		if(playerTurn === true) {
			// set player turn to false
			playerTurn = false;
			// set text to turn paragraph to "Computer's turn"
			document.querySelector("#turnInfo").innerHTML = "Computer's turn";
			// set a Timeout before calling makeComputerMove()
			setTimeout(makeComputerMove, 1000);
		}else{ // if computer just did turn
			// set player turn to true
			playerTurn = true;
			// set text to turn paragraph to "Your Turn"
			document.querySelector("#turnInfo").innerHTML = "Your turn";

			// there is no need to call for "boardButtonClicked" because it is already baked into the buttons
			// as a part of the click event.
		}
	}else if(gameStatus === 2){ // if there are no moves left
		// if human wins, set text to turn paragraph to "You win!"
		document.querySelector("#turnInfo").innerHTML = "You win!";
		playerTurn = false;
	}else if(gameStatus === 3){
		// if computer wins, set text to turn paragraph to "Computer wins!"
		document.querySelector("#turnInfo").innerHTML = "Computer wins!";
		playerTurn = false;
	}else{
		// if there's a tie, set text to turn paragraph to "Draw game"
		document.querySelector("#turnInfo").innerHTML = "Draw game";
		playerTurn = false;
	}
	
}

function makeComputerMove() {
	// Choose a random, available button
	const buttons = getGameBoardButtons();
	let i = 0;
	let randIndex = 0;
	// while loop to keep generating random numbers
	while(i === 0){
		randIndex = Math.floor(Math.random() * buttons.length);
		// check if buttons at a random index has an "X" or "O" in it's innerHTML
		if(buttons[randIndex].innerHTML != "X" && buttons[randIndex].innerHTML != "O" ) {
			// set button's inner html to "O"
			buttons[randIndex].innerHTML = "O";
			
			// set button class to "o"
			buttons[randIndex].classList.add("o");
			
			// add the disabled attribute to the button
			buttons[randIndex].setAttribute("disabled", " ");

			// end the while loop
			i = 1;
		}
			
	}

	// Call switchTurn() at the end of the function to switch back to the player's turn.
	switchTurn();
}