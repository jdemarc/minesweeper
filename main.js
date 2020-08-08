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

    buildBoard();
    layMines();
}

function handleSquareClick() {
    
}

function buildBoard() {
    let idx = 0; // Variable to give each square a unique ID.

    for (let i = 0; i < ROWS; i++) {
        let rowEl = document.createElement('tr');
        
        for(let j = 0; j < COLS; j++) {
            let squareEl = document.createElement('td');
            
            squareEl.setAttribute('id', idx);
            squareEl.innerHTML = '';

            rowEl.appendChild(squareEl);

            idx++;
        }

        boardEl.appendChild(rowEl);
    }
}

function layMines() {

    let repeatedRands = [];

    for (let i = 0; i < MINE_COUNT; i++) {
        let randMine = generateRandNum();
        
        if (!repeatedRands.includes(randMine)) {
            let randSquare = document.getElementsByTagName('td')[randMine];
            randSquare.innerHTML = 'X'; // This goes away later.
            randSquare.classList.add('mine');
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