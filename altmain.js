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
        // cellEls[idx].innerHTML = idx; // Debugging
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

    board[cellIdx] = 'clicked';

    checkAdjacentSquares(cellClass, cellIdx);
    
    renderBoard();
}

function checkAdjacentSquares(cClass, cIdx) {
    
    let minesFound = 0;

    //Returns index of cells surrounding the clicked cell.
    let neighborCellIdx = (getNeighborCells(cIdx));
    
    console.log(neighborCellIdx);

    //Check if the cell at neighborCellIdx has the mine class.
    
}
function getNeighborCells(cIdx) {
    let row = Math.floor(cIdx / 7);
    let col = cIdx % 7;

    let neighbors = [];

    if (row === 0) {
        //TOP LEFT
        if (col === 0) {
            neighbors.push(cIdx + 1, cIdx + 7, cIdx + 8);
            // console.log('Top left');
        
        //TOP MIDDLE
        } else if (col > 0 && col < 6) {
            neighbors.push(cIdx - 1, cIdx + 1, cIdx + 6, cIdx + 7, cIdx + 8);
            // console.log('Top middle');
        
        //TOP RIGHT
        } else {
            neighbors.push(cIdx - 1, cIdx + 6, cIdx + 7);
            // console.log('Top right');
        }
    
    } else if (row > 0 && row < 6) {
        //MIDDLE LEFT
        if (col === 0) {
            neighbors.push(cIdx - 7, cIdx - 6, cIdx + 1, cIdx + 7, cIdx + 8);
            // console.log("Middle left");
        
        //MIDDLE RIGHT
        } else if (col === 6) {
            neighbors.push(cIdx - 8, cIdx - 7, cIdx - 1, cIdx + 6, cIdx + 7);
            // console.log('middle right');

        //ANYWHERE NOT ON AN EDGE OR CORNER
        } else {
            neighbors.push(cIdx - 8, cIdx - 7, cIdx - 6,
                           cIdx - 1,              cIdx + 1,
                           cIdx + 6, cIdx + 7, cIdx + 8);
            
            // console.log("middle");
        }
    
    } else if (row === 6) {
        //BOTTOM LEFT
        if (col === 0) {
            neighbors.push(cIdx - 7, cIdx - 6, cIdx + 1);
            // console.log("bottom left");

        //BOTTOM MIDDLE
        } else if (col > 0 && col < 6) {
            neighbors.push(cIdx - 8, cIdx - 7, cIdx - 6, cIdx - 1, cIdx + 1);
            // console.log('bottom middle');

        // BOTTOM RIGHT
        } else {
            neighbors.push(cIdx - 1, cIdx - 8, cIdx - 7);
            // console.log('bottomRight');
        }
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
