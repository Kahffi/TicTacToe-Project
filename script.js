const gridItems = document.querySelectorAll(".grid-item");
const gameTypeInputs = document.querySelectorAll(".game-type-input");
const body = document.querySelector("body");
const gameTypeForm = document.getElementById("game-type-form");

const player1NameInput = createPlayerNameInput(1);
const player2NameInput = createPlayerNameInput(2);

const players = new Map();
const cols = 3;
const rows = 3;

//variables to track which player making a turn
const game = (function () {
	let round = 0;
	let gameCount = 1;

	const getRound = () => round;
	const getGameCount = () => gameCount;

	function updateGameCount() {
		gameCount *= -1;
	}

	const getCurrentPlayer = () => {
		if (gameCount < 0) {
			return players.get("player2");
		}
		return players.get("player1");
	};

	const getCurrentMoveType = () => {
		return getCurrentPlayer().getMoveType();
	};

	return { getRound, updateGameCount, getCurrentPlayer, getCurrentMoveType };
})();

let player1Avatar;
let player2Avatar;

function boardClick(e) {
	// extracting grid index from grid id
	const gridIdx = e.target.id.replace("grid", "") - 1;
	// can't insert an already occupied tile
	if (!isTileEmpty(gridIdx)) {
		return;
	}

	turn++;
	// setting board sign according to the player turn
	gridItems[gridIdx].textContent = game.getCurrentMoveType();

	// finding the winner only if turn already reach 5
	if (turn >= 5) {
		if (verticalCheck(game.getCurrentMoveType())) {
			const text = document.createElement("p");
			text.textContent = "winner detected (vertical)";
			body.appendChild(text);
		} else if (diagCheck(game.getCurrentMoveType())) {
			const text = document.createElement("p");
			text.textContent = "winner detected (diagonal)";
			body.appendChild(text);
		} else if (horizontalCheck(game.getCurrentMoveType())) {
			const text = document.createElement("p");
			text.textContent = "winner detected (horizontal)";
			body.appendChild(text);
		}
	}
	game.updateGameCount();
	setHoverText("");
}

function createPlayerNameInput(num) {
	const input = document.createElement("input");
	input.type = "text";
	input.name = `player-name`;
	input.value = `player${num}`;
	input.classList.add("name-input");
	input.required = true;
	return input;
}

// variables to track last selected gameType
let lastWrapper = null;

gameTypeForm.onsubmit = function (e) {
	e.preventDefault();

	if (lastWrapper == null) {
		return;
	}

	const data = new FormData(e.target);

	// assigning player 1 & 2 avatar if any game type is selected
	player1Avatar = lastWrapper
		.querySelector(".player1-avatar")
		.getAttribute("src");
	player2Avatar = lastWrapper
		.querySelector(".player2-avatar")
		.getAttribute("src");

	players.set("player1", createPlayer(data.getAll("player-name")[0], "X"));
	players.set("player2", createPlayer(data.getAll("player-name")[1], "O"));
	initGameDisplay();
};

gameTypeInputs.forEach((gameType) => {
	// When player choose game  type, the selected game type will have border color
	gameType.onchange = function (e) {
		if (lastWrapper != null) {
			// remove the outline from the unfocused gameType
			lastWrapper.classList.remove("selected");
		}
		// since the wrapper is the previous sibling of the radio input
		// *i do not wrap the radio input with the gametype card
		const wrapper = e.target.previousElementSibling;
		wrapper.classList.add("selected");
		lastWrapper = wrapper;
		lastWrapper.querySelector(".player1-info").appendChild(player1NameInput);
		lastWrapper.querySelector(".player2-info").appendChild(player2NameInput);
	};
});

gridItems.forEach((grid) => {
	grid.addEventListener("click", boardClick);
	grid.onmouseover = tileHover;
});

const mainMenu = (function () {
	const avatarImgs = [];
	const numOfAvatar = 21;

	const prevAvatarBtn = document.querySelectorAll(".select-btn.prev");
	const nextAvatarBtn = document.querySelectorAll(".select-btn.next");

	prevAvatarBtn.forEach((btn) => {
		btn.addEventListener("click", prevAvatar);
	});

	nextAvatarBtn.forEach((btn) => {
		btn.addEventListener("click", nextAvatar);
	});

	const initAvatarImgs = (function () {
		for (let i = 0; i < numOfAvatar; i++) {
			avatarImgs[i] = `src/img/avatars/Avatar${i + 1}.svg`;
		}
	})();

	function prevAvatar(e) {
		const avatarImg = e.target.nextElementSibling.querySelector("img");
		let imgIdx = avatarImg.getAttribute("src").replace(/[^\d]/g, "") - 1;

		if (imgIdx <= 1) {
			imgIdx = avatarImgs.length - 1;
		}

		avatarImg.src = avatarImgs[imgIdx - 1];
	}

	function nextAvatar(e) {
		const avatarImg = e.target.previousElementSibling.querySelector("img");
		let imgIdx = avatarImg.getAttribute("src").replace(/[^\d]/g, "") - 1;
		console.log(imgIdx);
		if (imgIdx >= avatarImgs.length - 1) {
			imgIdx = 0;
		}
		console.log(imgIdx);
		avatarImg.src = avatarImgs[imgIdx + 1];
	}
})();

const map = new Map();

let turn = 0;

function createPlayer(name, moveType) {
	let scores = 0;

	const getMoveType = () => moveType;
	const getName = () => name;
	const getScores = () => scores;

	function addScore() {
		scores++;
	}
	return { getMoveType, getName, addScore, getScores };
}

function tileHover(e) {
	const gridIdx = e.target.id.replace("grid", "") - 1;
	if (!isTileEmpty(gridIdx)) {
		setHoverText("");
		return;
	}
	if (players.size == 0) {
		return;
	}
	setHoverText(game.getCurrentMoveType());
}

function isTileEmpty(index) {
	return gridItems[index].textContent === "";
}

function horizontalCheck(moveType) {
	for (let i = 0; i < cols * 3; i += 3) {
		let found = 0;
		for (let j = i; j < rows; j++) {
			if (gridItems[j].textContent !== moveType) {
				break;
			}
			if (gridItems[j].textContent === moveType) {
				found++;
			}
		}

		if (found >= 3) {
			return true;
		}
	}
	return false;
}

function verticalCheck(moveType) {
	for (let i = 0; i < rows; i++) {
		let found = 0;
		for (let j = i; j < cols * 3; j += 3) {
			if (gridItems[j].textContent !== moveType) {
				break;
			}
			if (gridItems[j].textContent === moveType) {
				found++;
			}
		}
		if (found >= 3) {
			return true;
		}
	}
	return false;
}

function diagCheck(moveType) {
	// diagonal check
	let found = 0;
	for (let i = 0; i < 9; i += 4) {
		if (gridItems[i].textContent != moveType) {
			console.log("break");
			break;
		}
		found++;
		console.log(found, "diagonal");
		if (found >= 3) {
			return true;
		}
	}
	found = 0;
	// anti diagonal check
	for (let i = 6; i >= 2; i -= 2) {
		if (gridItems[i].textContent != moveType) {
			break;
		}
		found++;
		console.log(found, "anti-diagonal");
		if (found >= 3) {
			return true;
		}
	}
	return false;
}

function setHoverText(text) {
	document.documentElement.style.setProperty("--move-type", `'${text}'`);
}

function initGameDisplay() {
	document.querySelector(".main-menu.modal").classList.add("disabled");
	document.querySelector(".game-container").classList.remove("disabled");
	document.querySelector(".player1-avatar").setAttribute("src", player1Avatar);
	document.querySelector(".player2-avatar").setAttribute("src", player2Avatar);
	document.getElementById(`player1-name`).textContent = players
		.get("player1")
		.getName();
	document.getElementById(`player2-name`).textContent = players
		.get("player2")
		.getName();
}
