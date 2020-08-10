/*----- constants -----*/
const ROWS = 7;
const COLS = 7;
const MINE_COUNT = 9;

const lookup = {
    unclicked: 'gray',
    clicked: 'lightgray',

    flagged: 'yellow', // img
    mine: 'gray',
    reveal: 'red' // img
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
    //board = Array(ROWS).fill().map( () => Array(COLS).fill('null'));
    board = Array(ROWS * COLS).fill('unclicked');
    isPlaying = true;
    winner = null;

    layMines();
    renderBoard();
}

function renderBoard() {

    board.forEach(function(cell, idx) {
        cellEls[idx].style.background = lookup[cell];
    })

    // winner
}

function handleSquareClick(event) {

    if (event.target == undefined) {
        // console.log('hitting recursive inside handle square');
        // console.log('Event for undefined target', event);
        let cellIdx = event.id.replace('c-', '');

        //ISSUE WAS HERE
        checkAdjacentSquares(cellIdx);
        renderBoard();

    } else {

        //event is original 'click' here ************

        // console.log('Event: ', event);
        // console.log('Type of event: ', typeof event);
        // console.log('event.target: ', event.target)
        
        //strip 'c-' from id
        let cellIdx = event.target.id.replace('c-', '');

        const cellClass = event.target.className;
        //

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

// TODO
function handleResetClick() {
    //init();
    //cellEls.innerHTML = '';
}


function checkAdjacentSquares(cIdx) {

    let minesFound = 0;
    
    let neighborCellIdxArray = getNeighborCells(parseInt(cIdx));

    neighborCellIdxArray.forEach(function (neighbor) {
        if (cellEls[neighbor].className === 'mine') {
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
            let cellEl = document.getElementById(rMine);
            cellEl.setAttribute('class', 'mine');
            board[randMine] = 'mine';

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