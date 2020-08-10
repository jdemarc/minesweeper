/*----- constants -----*/
const ROWS = 7;
const COLS = 7;
const MINE_COUNT = 10;

const lookup = {
    unclicked: 'gray',
    clicked: 'lightgray',
    mine: 'gray',
    reveal: 'red'//'String.fromCodePoint(0x1F4A3)' // img
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
document.getElementById('reset').addEventListener('click', handleResetClick);

/*----- functions -----*/
init();

function init() {
    board = Array(ROWS * COLS).fill('unclicked');
    isPlaying = true;
    winner = null;

    layMines();
    renderBoard();

    console.log(board);
}

function renderBoard() {
    
    board.forEach(function(cell, idx) {
        cellEls[idx].style.background = lookup[cell];
    })
    // winner
}

//TODO
function getWinner() {

}

function handleSquareClick(event) {

    if (event.target === undefined) {
        let cellIdx = event.id.replace('c-', '');

        checkAdjacentSquares(cellIdx);
        renderBoard();

    } else {
        //Original Event Click
        
        //strip 'c-' from id
        let cellIdx = event.target.id.replace('c-', '');

        //TODO
        if (board[cellIdx] === 'mine') {

            console.log(board[cellIdx]);
            revealMines();

            isPlaying = false;
            winner = 'F';
            return;
        }

        board[cellIdx] = 'clicked';
        
        checkAdjacentSquares(cellIdx);
        renderBoard();
    }
    
}

function revealMines() {
    board.forEach(function (cell, idx) {
        if (cell === 'mine') {
            board[idx] = 'reveal';
        }
    })

    renderBoard();
}

function handleResetClick() {
    init();

    // Reset HTML of cells.
    board.forEach(function (cellEl, idx) {
        cellEls[idx].innerHTML = '';
    })
}


function checkAdjacentSquares(cIdx) {

    let minesFound = 0;
    
    let neighborCellIdxArray = getNeighborCells(parseInt(cIdx));

    neighborCellIdxArray.forEach(function (neighbor) {
        if (board[neighbor] === 'mine') {
            minesFound++;
        }

    })
    board[cIdx] = 'clicked';
    cellEls[cIdx].innerHTML = minesFound;

 
    // Recursively check surrounding cells for mines.
    // If there are no mines found, reveal neighbor values.
    if (minesFound === 0) {

        neighborCellIdxArray.forEach(function (e) {
            if (board[e] === 'unclicked') {
                handleSquareClick(cellEls[e]);
            }
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
        
        //TOP MIDDLE
        } else if (col > 0 && col < 6) {
            neighbors.push(cIdx - 1, cIdx + 1, cIdx + 6, cIdx + 7, cIdx + 8);
        
        //TOP RIGHT
        } else {
            neighbors.push(cIdx - 1, cIdx + 6, cIdx + 7);
        }
    
    } else if (row > 0 && row < 6) {
        //MIDDLE LEFT
        if (col === 0) {
            neighbors.push(cIdx - 7, cIdx - 6, cIdx + 1, cIdx + 7, cIdx + 8);
        
        //MIDDLE RIGHT
        } else if (col === 6) {
            neighbors.push(cIdx - 8, cIdx - 7, cIdx - 1, cIdx + 6, cIdx + 7);

        //ANYWHERE NOT ON AN EDGE OR CORNER
        } else {
            neighbors.push(cIdx - 8, cIdx - 7, cIdx - 6,
                           cIdx - 1,              cIdx + 1,
                           cIdx + 6, cIdx + 7, cIdx + 8);
            
        }
    
    } else if (row === 6) {
        //BOTTOM LEFT
        if (col === 0) {
            neighbors.push(cIdx - 7, cIdx - 6, cIdx + 1);

        //BOTTOM MIDDLE
        } else if (col > 0 && col < 6) {
            neighbors.push(cIdx - 8, cIdx - 7, cIdx - 6, cIdx - 1, cIdx + 1);

        // BOTTOM RIGHT
        } else {
            neighbors.push(cIdx - 1, cIdx - 8, cIdx - 7);
        }
    }
    
    return neighbors;
}

function layMines() {
    
    let repeatedRands = [];

    for (let i = 0; i < MINE_COUNT; i++) {
        let randMine = generateRandNum();
        let rMine = 'c-' + randMine;
        
        if (!repeatedRands.includes(rMine)) {
            //used for debugging
            let cellEl = document.getElementById(rMine);
            cellEl.innerHTML = 'm';

            board[randMine] = 'mine';

            repeatedRands.push(rMine);
        } else {
            randMine = generateRandNum();
            i--;
        }
    }

    console.log('Randoms: ', repeatedRands);
}

function generateRandNum() {
    return Math.floor(Math.random() * (ROWS*COLS - 0));
}