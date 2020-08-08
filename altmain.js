/*----- constants -----*/
const ROWS = 7;
const COLS = 7;
const MINE_COUNT = 10;

const lookup = {
    unclicked: 'gray',
    clicked: 'lightgray',

    flagged: 'yellow', // img
    mine: 'red', // img
};


/*----- app's state (variables) -----*/
/*
class Cell {
    constructor (id, rowPos, colPos) {
        this.id = id;
        this.rowPos = rowPos;
        this.colPos = colPos;
        this.isMine = false;
        this.isFlagged = false;
        this.isClicked = false;
    }
}; */

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
const cellEls = document.querySelectorAll('td');

/*----- event listeners -----*/
document.querySelector('table').addEventListener('click', handleSquareClick);

/*----- functions -----*/
init();

function init() {
    //board = Array(ROWS).fill().map( () => Array(COLS).fill('null'));
    board = Array(ROWS * COLS).fill('unclicked');
    isPlaying = true;
    winner = null;

    layMines();
    renderBoard();
}

function renderBoard() {

    board.forEach(function(cell, idx) {
        cellEls[idx].innerHTML = idx; // Debugging
        cellEls[idx].style.background = lookup[cell];
    })

    //winner;
}

function handleSquareClick(event) {
    console.log(event.target.id);
    
    const cellIdx = parseInt(event.target.id);
    const cellClass = event.target.className;
    
    console.log(cellClass);
    
    if (cellClass === 'mine') {
        isPlaying = false;
        return;
    }

    
    checkAdjacentSquares(cellIdx);
    
    renderBoard();
}

function checkAdjacentSquares(cellIdx) {

    console.log(getNeighborCells(cellIdx));

    // Iterate around clicked square.
    let mineCount = 0;
    
    
    // Count the number of 'mine' classes.
    // set board index to number of mines found.
    board[cellIdx] = 'clicked';
    
}
function getNeighborCells(cellIdx) {
    let row = Math.floor(cellIdx / 7);
    let col = cellIdx % 7;

    console.log('Row: ', row, 'Col: ', col);
    let neighbors = [];

    if (row === 0) {
        if (col === 0) {
            neighbors.push(cellIdx + 1, cellIdx + 7, cellIdx + 8);
        } else if (col > 0 && col < 6) {
            neighbors.push(cellIdx - 1, cellIdx + 1, cellIdx + 6, cellIdx + 7, cellIdx + 8);
        } else {
            neighbors.push(cellIdx - 1, cellIdx + 6, cellIdx + 7);
        }
    // } else if (row === 0 && (col > 0 && col < 6)) {
    // } else if (row === 0 && col === 6) {
    
    } else if (row > 0 && row < 6) {
        if (col === 0) {
            neighbors.push(cellIdx - 7, cellIdx - 6, cellIdx + 1, cellIdx + 7, cellIdx + 8)
        }

    
    } else if (row === 6) {
        if (col === 0) {
            neighbors.push(cellIdx + 1, cellIdx - 7, cellIdx - 6);
        } else if (col > 0 && col < 6) {
            neighbors.push(cellIdx - 8, cellIdx - 7, cellIdx - 6, cellIdx - 1, cellIdx + 1);
        } else {
            neighbors.push(cellIdx - 1, cellIdx - 8, cellIdx - 7)
        }

        
        // neighbors.push(cellIdx - 8, cellIdx - 7, cellIdx - 6,
        //                cellIdx - 1,              cellIdx + 1,
        //                cellIdx + 6, cellIdx + 7, cellIdx + 8);
    }
    
    return neighbors;
}

function layMines() {
    
    let repeatedRands = [];

    for (let i = 0; i < MINE_COUNT; i++) {
        let randMine = generateRandNum();
        
        if (!repeatedRands.includes(randMine)) {
            let cellEl = document.getElementById([randMine]);
            cellEl.innerHTML = 'X'; // This goes away.
            cellEl.classList.remove('cell');
            cellEl.classList.add('mine');

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
