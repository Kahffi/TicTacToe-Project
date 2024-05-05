const startBtn = document.getElementById("start-btn");

function Game(player1, player2) {
	const board = [
		["", "", ""],
		["", "", ""],
		["", "", ""],
	];

	const players = new Map();
	const numOfRound = 0;
	let winner = null;

	players.set(player1.getMoveType(), player1);
	players.set(player2.getMoveType(), player2);

	function setBoard(moveArr, playerType) {
		board[moveArr[0]][moveArr[1]] = playerType;
	}
	function addRound() {
		return numOfRound++;
	}

	const boardCrawl = (function () {
		const horizontal = (moveType) => {
			for (let row = 0; row <= 2; row++) {
				let found = 0;
				for (let col = 0; col <= 2; col++) {
					if (board[row][col] === moveType) {
						found++;
					}

					if (found >= 3) {
						return moveType;
					}
				}
			}
			return null;
		};

		const vertical = (moveType) => {
			for (let col = 0; row <= 2; row++) {
				let found = 0;
				for (let row = 0; col <= 2; col++) {
					if (board[row][col] === moveType) {
						found++;
					}

					if (found >= 3) {
						return moveType;
					}
				}
			}
			return null;
		};

		return { horizontal };
	})();

	function setWinner(moveType) {
		if (moveType != null) {
			winner = players.get(moveType);
			console.log(winner);
			declareWinner();
		}
	}

	function declareWinner() {
		alert("The winner is" + `${winner.getName()}`);
	}

	function start() {
		alert("Game started");
		let turn = 0;
		while (winner === null || turn < 5) {
			turn++;
			player1.setMove();
			setBoard(player1.getMove(), player1.getMoveType());
			console.table(board);
			if (turn >= 3) {
				setWinner(boardCrawl.horizontal(player1.getMoveType()));
			}
			player2.setMove();
			setBoard(player2.getMove(), player2.getMoveType());
			console.table(board);
			if (turn >= 3 && winner == null) {
				setWinner(boardCrawl.horizontal(player1.getMoveType()));
			}
		}
	}

	const getBoard = () => board;
	const getNumOfRound = () => numOfRound;
	return { getBoard, setBoard, getNumOfRound, addRound, start };
}

// player class
function createPlayer(name, moveType) {
	const score = 0;

	function setName(newName) {
		name = newName;
	}
	function addScore() {
		score++;
	}

	const getName = () => name;
	const getScores = () => score;
	const getMoveType = () => moveType;

	return { getName, getScores, addScore, getMoveType };
}

function createPC(name, moveType) {
	const player = createPlayer(name, moveType);
	let move;

	function setMove() {
		move = prompt(`${name}, please make a move`).split(" ");
	}
	const getMove = () => move;

	return Object.assign({}, { setMove, getMove }, player);
}

function createBot() {
	const player = createPlayer("BOT");

	return Object.assign({}, player);
}

const player1 = createPC("John", "x");
const player2 = createPC("Dhoe", "o");

const game2 = Game(player1, player2);
console.log(player1.getMoveType());
startBtn.onclick = game2.start;
