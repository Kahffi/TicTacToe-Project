const gridItems = document.querySelectorAll(".grid-item");
const body = document.querySelector("body");

let turn = 0;

gridItems.forEach((grid) => {
	grid.addEventListener("click", boardClick);
	grid.onmouseover = tileHover;
});

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
