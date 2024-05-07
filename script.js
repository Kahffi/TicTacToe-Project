const gridItems = document.querySelectorAll(".grid-item");
const gameTypeInputs = document.querySelectorAll(".game-type-input");
const body = document.querySelector("body");

let lastWrapper = null;

gameTypeInputs.forEach((gameType) => {
	console.log(gameType);
	gameType.onchange = function (e) {
		if (lastWrapper != null) {
			lastWrapper.classList.remove("selected");
		}
		const wrapper = e.target.previousElementSibling;
		wrapper.classList.add("selected");
		lastWrapper = wrapper;
		console.log("clicked");
	};
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
			console.table(avatarImgs);
		}
	})();

	function prevAvatar(e) {
		const avatarImg = e.target.nextElementSibling;
		let imgIdx = avatarImg.getAttribute("src").replace(/[^\d]/g, "") - 1;

		if (imgIdx <= 1) {
			imgIdx = avatarImgs.length - 1;
		}

		avatarImg.src = avatarImgs[imgIdx - 1];
	}

	function nextAvatar(e) {
		const avatarImg = e.target.previousElementSibling;
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

gridItems.forEach((grid) => {
	grid.addEventListener("click", boardClick);
	grid.onmouseover = tileHover;
});

function createPlayer(name, moveType) {
	let scores = 0;

	const getMoveType = () => moveType;
	const getName = () => name;
	const getScores = () => getScores;
	return { getMoveType, getName };
}

function boardClick(e) {
	const gridIdx = e.target.id.replace("grid", "") - 1;

	// can't insert an already occupied tile
	if (!isTileEmpty(gridIdx)) {
		return;
	}

	turn++;
	gridItems[gridIdx].textContent = "X";

	// finding the winner only if turn already reach 5
	if (turn >= 5) {
		if (horizontalCheck("X")) {
			const text = document.createElement("p");
			text.textContent = "winner detected";

			body.appendChild(text);
		}
	}
	setHoverText("");
}

function tileHover(e) {
	console.log("hovered");
	const gridIdx = e.target.id.replace("grid", "") - 1;
	if (!isTileEmpty(gridIdx)) {
		setHoverText("");
		return;
	}
	setHoverText("pop");
}

function isTileEmpty(index) {
	return gridItems[index].textContent === "";
}

function horizontalCheck(moveType) {
	const cols = 3;
	const rows = 3;
	for (let i = 0; i < cols; i += 3) {
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

function verticalCheck(moveType) {}

function diagCheck(moveType) {}

function antiDiagCheck(moveType) {}

function setHoverText(text) {
	console.log(document.documentElement.style);
	document.documentElement.style.setProperty("--move-type", `'${text}'`);
}
