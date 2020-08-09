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

    const cellIdx = parseInt(event.target.id);
    const cellClass = event.target.className;

    // if (cellClass === 'mine') {
    //     isPlaying = false;
    //     revealBoard();
    //     return;
    // }

    board[cellIdx] = 'clicked';
    
    checkAdjacentSquares(cellIdx);
    renderBoard();
}

function checkAdjacentSquares(cIdx) {
    
    let minesFound = 0;

    //Returns index of cells surrounding the clicked cell.
    let neighborCellIdxArray = getNeighborCells(cIdx);

    neighborCellIdxArray.forEach(function (neighbor) {
        if (cellEls[neighbor].className === 'mine') {
            minesFound++;
        }
    })
    
    cellEls[cIdx].innerHTML = minesFound;
 
    // Recursively
    if (minesFound === 0) {
        // Check each adjacent cell for a mine.
        // Repeat.
        let newNeighbors = [];

        neighborCellIdxArray.forEach(function (e) {
            console.log(e);
            newNeighbors = getNeighborCells(e);

            console.log(newNeighbors);
            //checkAdjacentSquares(newNeighbors);
        })

    }
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
            cellEl.setAttribute('class', 'mine');
            //board[randMine] = 'mine';

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