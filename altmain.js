/*----- constants -----*/
const ROWS = 7;
const COLS = 7;
const MINE_COUNT = 10;

const lookup = {
    unclicked: 'darkgray',
    clicked: 'lightgray',

    mine: 'darkgray',
    flagged: 'darkgray',
    reveal: 'red'
};

/*----- app's state (variables) -----*/

let isPlaying;
let winner;
let board;

/*----- cached element references -----*/
const cellEls = document.querySelectorAll('td');
const message = document.getElementById('message');

/*----- event listeners -----*/
document.querySelector('table').addEventListener('click', handleLeftClick);
document.querySelector('table').addEventListener("contextmenu", handleRightClick);
document.getElementById('reset').addEventListener('click', handleResetClick);

/*----- functions -----*/
init();

function init() {
    board = Array(ROWS * COLS).fill('unclicked');
    isPlaying = true;
    winner = 'N';

    layMines();
    renderBoard();

    console.log(board);
}

function renderBoard() {
    
    board.forEach(function(cell, idx) {
        cellEls[idx].style.background = lookup[cell];
    })

    renderMessage();
}

function renderMessage() {

    if (!isPlaying && winner === 'L') {
        message.innerHTML = String.fromCodePoint('0x1F480')
    } else if (winner === 'N') {
        message.innerHTML = String.fromCodePoint('0x1F610');
    } else {
        message.innerHTML = String.fromCodePoint('0x1F60E');
    }
}

//TO DO .... user must set flags in appropriate spaces AND have no unclicked areas.
function getWinner() {

    if (!board.includes('unclicked')) {
        isPlaying = false;
        revealMines();
        return 'W';
    }

    return 'N';
}

function handleLeftClick(event) {

    if (event.target === undefined) {
        if(!isPlaying) return;

        let cellIdx = event.id.replace('c-', '');

        if (cellEls[cellIdx].classList.contains('flagged')) return;

        if (board[cellIdx] === 'mine') {

            isPlaying = false;
            winner = 'L';

            revealMines();
            cellEls.style.pointerEvents = 'none';

            return;
        }
        
        board[cellIdx] = 'clicked';

        checkAdjacentSquares(cellIdx);
        winner = getWinner();
        renderBoard();

            
    } else {

        evaluateSquare(event);

    }
}

function evaluateSquare(event) {
    if (!isPlaying) return;

    // Parse integer from element id.
    let cellIdx = event.target.id.replace('c-', '');
    
    // Prevent clicking flagged squares.
    if (cellEls[cellIdx].classList.contains('flagged')) return;

    if (board[cellIdx] === 'mine') {

        isPlaying = false;
        winner = 'L';

        revealMines();
        cellEls.style.pointerEvents = 'none';
        return;
    }

    board[cellIdx] = 'clicked';
    
    checkAdjacentSquares(cellIdx);
    winner = getWinner();
    renderBoard();
}

//TODO: Fix bug with overriding mine class name.
function handleRightClick(event) {
    if (!isPlaying) return;

    event.preventDefault();
    const idx = event.target.id.replace('c-', '');

    if ((cellEls[idx].innerHTML === '')) {
        cellEls[idx].classList.toggle('flagged');
    }

}

function revealMines() {
    board.forEach(function (cell, idx) {
        if (cell === 'mine') {
            board[idx] = 'reveal';
            cellEls[idx].setAttribute('class', 'bomb');
            cellEls[idx].innerHTML = String.fromCodePoint(0x1F4A3);
        }
    })

    renderBoard();
}

function handleResetClick() {
    
    // Reset HTML of cells.
    board.forEach(function (cellEl, idx) {
        cellEls[idx].innerHTML = '';
        cellEls[idx].setAttribute('class', 'cell');
    })

    init();
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
                handleLeftClick(cellEls[e]);
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