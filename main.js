/*----- constants -----*/
const ROWS = 7;
const COLS = 7;
const MINE_COUNT = 10;

const lookup = {
    unclicked: 'darkgray',
    clicked: 'lightgray',
    flagged: 'darkgray',
    mine: 'darkgray',
    reveal: 'red'
};

/*----- app's state (variables) -----*/

let isPlaying; // true or false
let winner; // W, N, L
let board;
let time;

/*----- cached element references -----*/
const cellEls = document.querySelectorAll('td');
const emojiEl = document.getElementById('face');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

/*----- event listeners -----*/
document.querySelector('table').addEventListener('click', handleLeftClick);
document.querySelector('table').addEventListener('contextmenu', handleRightClick);
document.getElementById('reset').addEventListener('click', handleResetClick);

/*----- functions -----*/
init();

function init() {
    board = Array(ROWS * COLS).fill('unclicked');
    isPlaying = true;
    winner = 'N';
    time = 0;

    layMines();
    renderBoard();
}

function renderBoard() {
    
    board.forEach(function(cell, idx) {
        cellEls[idx].style.background = lookup[cell];
    })

    renderEmoji();
}

function renderEmoji() {

    if (winner === 'L') {
        emojiEl.innerHTML = String.fromCodePoint('0x1F480');
    } else if (winner === 'N') {
        emojiEl.innerHTML = String.fromCodePoint('0x1F643');
    } else {
        emojiEl.innerHTML = String.fromCodePoint('0x1F60E');
    }
}

function getWinner() {

    if (!board.includes('unclicked')) {
        isPlaying = false;
        reveal('W');
        return 'W';
    }

    return 'N';
}

function handleLeftClick(event) {
    if (!isPlaying) return;
    if (!time) time = timer();
    
    let cellIdx;
    
    event.target === undefined ? cellIdx = event.id.replace('c-', '')
        : cellIdx = event.target.id.replace('c-', '');

    evaluateSquare(cellIdx);
}

function evaluateSquare(cellIdx) {
    
    // Prevents clicking flagged squares.
    if (cellEls[cellIdx].classList.contains('flagged')) return;

    if (board[cellIdx] === 'mine') {
        
        isPlaying = false;
        winner = 'L';
        reveal('L');
        return;
    }
    
    board[cellIdx] = 'clicked';
    
    checkAdjacentSquares(cellIdx);
    winner = getWinner();
    renderBoard();
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
    //Display mines found on board.
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

function handleRightClick(event) {
    if (!isPlaying) return;
    if (!time) time = timer();

    event.preventDefault();
    const idx = event.target.id.replace('c-', '');


    if (board[idx] === 'clicked') return;

    cellEls[idx].classList.toggle('flagged');
}

// Condense with if.
function reveal(gameState) {
    board.forEach(function(e, idx) {
        if (e === 'mine') {
            if (gameState === 'W') {
                board[idx] = 'flagged';
                cellEls[idx].setAttribute('class', 'flagged');                
            } else {
                board[idx] = 'reveal';
                cellEls[idx].setAttribute('class', 'bomb');    
            }
        }
    })

    stopTimer(time);
    renderBoard();
}

function handleResetClick() {
    
    // Reset HTML of cells.
    board.forEach(function (cellEl, idx) {
        cellEls[idx].innerHTML = '';
        cellEls[idx].setAttribute('class', 'cell');
    })


    secondsEl.innerHTML = '00';
    minutesEl.innerHTML = '00';

    stopTimer(time);
    init();
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
                           cIdx - 1,           cIdx + 1,
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
        //Generate a random number and remove the 'c-' from the id for the integer value.
        let randMine = generateRandNum();
        let rMine = 'c-' + randMine;
        
        // If the value is not in repeatedRands, assign it to the board at the index
        // where it appears.  Store that number in the repeatedRands array so duplicates
        // do not occur.
        if (!repeatedRands.includes(rMine)) {

            board[randMine] = 'mine';

            repeatedRands.push(rMine);
        } else {
            // If a random is a duplicate, decrement the counter and generate a new random number.
            randMine = generateRandNum();
            i--;
        }
    }
}

function generateRandNum() {
    return Math.floor(Math.random() * (ROWS*COLS - 0));
}

function timer() {

    let sec = 0;

    function formatTime(value) {
        return value > 9 ? value : '0' + value;
    }

    let t = setInterval(function() {
        secondsEl.innerHTML = formatTime(++sec % 60);
        minutesEl.innerHTML = formatTime(parseInt(sec/60), 10);
    }, 1000); 

    return t;

}

function stopTimer(t) {
    clearInterval(t);
}

// TO DO: Condense reveal function
// Condense handlers.