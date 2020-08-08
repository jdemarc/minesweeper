/*----- constants -----*/
const ROWS = 7;
const COLS = 7;
const MINE_COUNT = 10;

const lookup = {
    null: 'gray',
    flagged: 'yellow',
    safe: 'lightgray',
    mine: 'red',
};

/*----- app's state (variables) -----*/
let isPlaying; // boolean to determine if game is playing or game has stopped.
let winner;
    /**
     * winner states ---
     * null
     * won
     * lost
     */
let board;

/*----- cached element references -----*/
const squareEls = document.querySelectorAll('td');

/*----- event listeners -----*/
document.querySelector('table').addEventListener('click', handleSquareClick);

/*----- functions -----*/
init();

function init() {
    // board = Array(ROWS).fill().map( () => Array(COLS).fill(null));
    board = Array(ROWS * COLS).fill(null);
    isPlaying = true;
    winner = null;

    layMines();
    renderBoard();
}

function renderBoard() {

    board.forEach(function(square, idx) {
        squareEls[idx].style.background = lookup[square];
    })

    //winner;
}

function handleSquareClick(event) {
    console.log(event.target.id);

    const idx = event.target.id;
    const squareClass = event.target.className;

    console.log(squareClass);

    if (squareClass === 'mine') {
        isPlaying = false;
        return;
    }

    board[idx] = 'safe';

    checkAdjacentSquares();

    renderBoard();
}

function checkAdjacentSquares() {

}

function layMines() {

    let repeatedRands = [];

    for (let i = 0; i < MINE_COUNT; i++) {
        let randMine = generateRandNum();
        
        if (!repeatedRands.includes(randMine)) {
            let squareEl = document.getElementById([randMine]);
            squareEl.innerHTML = 'X'; // This goes away.
            squareEl.classList.remove('cell');
            squareEl.classList.add('mine');

            repeatedRands.push(randMine);
        } else {
            randMine = generateRandNum();
            i--;
        }
    }
}

function generateRandNum() {
    return Math.floor(Math.random() * (ROWS*COLS - 0));
}