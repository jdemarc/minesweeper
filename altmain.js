/*----- constants -----*/
const ROWS = 7;
const COLS = 7;
const MINE_COUNT = 10;

const lookup = {
    null: 'gray',
    flagged: 'yellow',
    safe: 'green',
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
const boardEl = document.getElementById('main-grid');
const squareEls = document.querySelectorAll('.cell');

/*----- event listeners -----*/


/*----- functions -----*/
init();

function init() {
    // board = Array(ROWS).fill().map( () => Array(COLS).fill(null));
    board = Array(ROWS * COLS).fill(null);
    isPlaying = true;
    winner = null;

    renderBoard();
}

function renderBoard() {

    board.forEach(function(square, idx) {
        squareEls[idx].style.background = lookup[square];
    })

    //winner
}

function handleSquareClick() {
    
}


function layMines() {

    let repeatedRands = [];

    for (let i = 0; i < MINE_COUNT; i++) {
        let randMine = generateRandNum();
        
        if (!repeatedRands.includes(randMine)) {
            squareEls.classList.add('mine');
            squareEls.innerHTML = 'X';

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