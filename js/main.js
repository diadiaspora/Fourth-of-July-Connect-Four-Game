/* 
Identify State variables for connect four:

BOARD:
Array of arrays,where the nested arrays will represent the columns.

Values that the elements contains

* 1/-1 -> player
* null -> cell is empty

WINNER:
Values:
* null -> no winner or tie, game is in progress
* 1/-1 -> the player that one
* 'Tie' -> the game is tied

TURN:
* 1/-1 -> which player

*/

/*----- constants -----*/

//look up data structure

const COLORS = {
  1: "red",
  "-1": "blue",
  null: "white",
};

/*----- state variables -----*/
// define but do not assign to (initialize)
let board; // 2D array / 1/-1 -> player value; -> cell is empty
let winner; // null -> no winner or tie, game id in progress; 1/-1 -> the player that won ; 'Tie' -> the game has tied
let turn; // the player whose turn it is.

/*----- cached elements  -----*/
const msgEl = document.querySelector("h1");
const playAgainBtn = document.getElementById("play");
const markerEls = [...document.querySelectorAll("#markers > div")]; //convert the nodelist into an array
const celebrationEl = document.getElementById("celebration");
const winnerTextEl = document.getElementById("winner-text");
/*----- event listeners -----*/

document.getElementById("markers").addEventListener("click", handleDrop);
playAgainBtn.addEventListener("click", init);

/*----- functions -----*/
//The init functions purpose is to initialize all state, tnen call render()

init();

function init() {
  celebrationEl.classList.remove("show");
  // to visualize the mapping (connection) between
  // the board array and the cells/divs in the DOM.
  // "rotate" the board 90 degrees counter clockwise

  board = [
    [null, null, null, null, null, null], // column 0
    [null, null, null, null, null, null], // column 1
    [null, null, null, null, null, null], // column 2
    [null, null, null, null, null, null], // column 3
    [null, null, null, null, null, null], // column 4
    [null, null, null, null, null, null], // column 5
    [null, null, null, null, null, null], // column 6
  ];

  winner = null;
  turn = 1;
  render();
}

// in response to user interaction, update all impacted state, then call render()

function handleDrop(evt) {
  console.log(evt.target);
  // 1) Determine the index of the clicked column marker.

  const colIdx = markerEls.indexOf(evt.target);
  console.log(colIdx);
  // 2) If not a valid index, do nothing (return from function).
  if (colIdx === -1) return;
  // 3) Create a shortcut variable to the clicked column array, e.g., `colArr`.
  const colArr = board[colIdx];
  console.log(colArr);
  // 4) Determine the index of the first available "cell" (first `null` element in `colArr`).
  const rowIdx = colArr.indexOf(null);
  console.log(rowIdx);
  // 5) Update the "cell" in `colArr` with whose turn it is.
  colArr[rowIdx] = turn;
  chipFirework(colIdx, rowIdx);
  // 6) Compute and update the state of the game (winner?).
  winner = getWinner(colIdx, rowIdx);

  if (winner && winner !== "Tie") {
      winnerTextEl.textContent = `${COLORS[winner].toUpperCase()} WINS!`;
      winnerTextEl.style.color = COLORS[winner];

      winnerTextEl.style.textShadow =
        winner === 1
          ? "0 0 10px red, 0 0 25px red, 0 0 45px white"
          : "0 0 10px dodgerblue, 0 0 25px dodgerblue, 0 0 45px white";

    celebrationEl.classList.add("show");

    launchFireworks();
  }

  // 7) Update whose turn it is.
  turn *= -1;

  // 8) All state has been updated - call render()!
  render();
}

function getWinner(colIdx, rowIdx) {
  return (
    checkVertical(colIdx, rowIdx) ||
    checkHorizontal(colIdx, rowIdx) ||
    checkBackslash(colIdx, rowIdx) ||
    checkForwardslash(colIdx, rowIdx) ||
    checkTie()
  );
}

function checkTie() {
  for (let colArr of board) {
    if (colArr.includes(null)) return null;
  }
  return "Tie";
}

function checkVertical(colIdx, rowIdx) {
  const numBelow = countAdjacent(colIdx, rowIdx, 0, -1);
  return numBelow === 3 ? turn : null;
}

function checkHorizontal(colIdx, rowIdx) {
  const numLeft = countAdjacent(colIdx, rowIdx, -1, 0);
  const numRight = countAdjacent(colIdx, rowIdx, 1, 0);
  return numLeft + numRight >= 3 ? turn : null;
}

function checkBackslash(colIdx, rowIdx) {
  const numLeft = countAdjacent(colIdx, rowIdx, -1, 1);
  const numRight = countAdjacent(colIdx, rowIdx, 1, -1);
  return numLeft + numRight >= 3 ? turn : null;
}

function checkForwardslash(colIdx, rowIdx) {
  const numLeft = countAdjacent(colIdx, rowIdx, -1, -1);
  const numRight = countAdjacent(colIdx, rowIdx, 1, 1);
  return numLeft + numRight >= 3 ? turn : null;
}

/* 
col/rowDelta represents the value that col/rowIdx will 
change by after each iteration */

function countAdjacent(colIdx, rowIdx, colDelta, rowDelta) {
  let count = 0;
  colIdx += colDelta;
  rowIdx += rowDelta;
  /* use a while loop when you dont know how many times you need to loop iterate */
  while (board[colIdx] && board[colIdx][rowIdx] === turn) {
    count++;
    colIdx += colDelta;
    rowIdx += rowDelta;
  }
  return count;
}
/* 
the purpose of the render() function is to transfer/visualize in the DOM */
function render() {
  renderBoard();
  renderMessage();
  renderControls();
}

function renderBoard() {
  board.forEach((colArr, colIdx) => {
    // console.log(colArr);
    // console.log(colIdx);
    colArr.forEach((cellVal, rowIdx) => {
      // console.log(cellVal);
      // console.log(rowIdx);

      const cellEl = document.getElementById(`c${colIdx}r${rowIdx}`);
      cellEl.style.background = COLORS[cellVal];
    });
  });
}

function renderMessage() {
  // msgEl.innerHTML = 'Player';
  if (winner === null) {
    msgEl.innerHTML = `<span style ="color:${COLORS[turn]}"> ${COLORS[turn].toUpperCase()}</span>'s Turn`;
  } else if (winner === "Tie") {
    msgEl.innerHTML = "Its a Tie";
  } else {
    // there is a winner
    msgEl.innerHTML = `<span style ="color:${COLORS[winner]}"> ${COLORS[winner].toUpperCase()}</span>' Wins!`;
  }
}

function renderControls() {
  // ternary expression - use when you want to return one of two values
  //<conditional exp> ? <truthy exp> : <falsy exp>
  playAgainBtn.style.visibility = winner ? "visible" : "hidden";
  // TODO: conditionally render the markers
  markerEls.forEach((markerEl, colIdx) => {
    const showMarker = board[colIdx].includes(null) && !winner;
    markerEl.style.visibility = showMarker ? "visible" : "hidden";
  });
}

function launchFireworks() {
  const duration = 3000;

  const end = Date.now() + duration;

  const colors = ["#ff0000", "#ffffff", "#0047ab"];

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      origin: { x: 0 },
      colors,
    });

    confetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}



function chipFirework(colIdx, rowIdx) {
  const chip = document.getElementById(`c${colIdx}r${rowIdx}`);

  for (let i = 0; i < 24; i++) {
    const particle = document.createElement("span");

    particle.className = "particle";

    particle.style.width = `${2 + Math.random() * 3}px`;
    particle.style.height = particle.style.width;

    particle.style.boxShadow = "0 0 6px white";

      particle.style.animationDelay = `${Math.random() * 100}ms`;
      
      particle.style.filter = "blur(.4px)";
      particle.style.opacity = 0.9;

    chip.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;

    const distance = 18 + Math.random() * 18;

    const x = Math.cos(angle) * distance;

    const y = Math.sin(angle) * distance;

    particle.animate(
      [
        {
          transform: "translate(-50%,-50%) scale(.2)",
          opacity: 1,
        },

        {
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`,
          opacity: 1,
          offset: 0.7,
        },

        {
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`,
          opacity: 0,
        },
      ],

      {
        duration: 700,
        easing: "ease-out",
      },
    );

    particle.addEventListener("animationend", () => particle.remove());

    setTimeout(() => particle.remove(), 700);
  }
}