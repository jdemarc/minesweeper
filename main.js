/*----- constants -----*/
class Cell {
    constructor(id, rowPos, colPos) {
        this.id = id;
        this.rowPos = rowPos;
        this.colPos = colPos;
        this.closeMines = 0;
        this.isFlagged = false;
        this.isMine = false;
        this.isClicked = false;
    }
}
/*----- globals -----*/
let ROWS = 4;
let COLS = 4;
let MINES = 2;

/*----- app's state (variables) -----*/
let isPlaying;
let winner;
let board;

/*----- cached element references -----*/
const boardEl = document.getElementById('main-grid');
const emojiEl = document.getElementById('emoji');

const buttonEl = document.getElementById('submit');

/*----- event listeners -----*/
boardEl.addEventListener('click', handleLeftClick);
boardEl.addEventListener('contextmenu', handleRightClick);
emojiEl.addEventListener('click', handleResetClick);
buttonEl.addEventListener('click', handleSubmitClick);

/*----- functions -----*/
init();

function init() {
    //Clear board HTML.
    boardEl.innerHTML = '';

    board = [];
    //Build the board array data structure.
    for (let i = 0; i < ROWS; i++) {
        board.push([0]);
        for (let j = 0; j < COLS; j++) {
            board[i][j] = 0;
        }
    }

    //Give each cell an ID. Mostly debugging purposes.
    let idx = 0;

    for (i = 0; i < ROWS; i++) {
        for (j = 0; j < COLS; j++) {
            board[i][j] = new Cell(idx, i, j);
            idx++;
        }
    }
    
    isPlaying = true;
    winner = 'N';

    buildBoard(ROWS, COLS);
    layMines(MINES);
    render();
}

function handleSubmitClick() {
    ROWS = document.getElementById('rows').value;
    COLS = document.getElementById('cols').value;
    let inputMines = document.getElementById('mines').value;

    validateInput(ROWS, COLS, inputMines);

    init();
}

function validateInput(rows, cols, inputM) {

    if (rows * cols > inputM) {
        MINES = document.getElementById('mines').value;
    } else {
        MINES = rows * cols - 1;
        console.log('mines fixed');
    }
}

function render() {
    //Render board HTML.
    board.forEach(function(row, rIdx) {
        row.forEach(function(cell, cIdx) {
            let targetCell = boardEl.rows[rIdx].cells[cIdx];

            if (cell.isClicked && !cell.isFlagged) {
                targetCell.setAttribute('class', 'clicked');
                targetCell.innerHTML = cell.closeMines;
            }

            if (!cell.isClicked && cell.isFlagged) {
                targetCell.setAttribute('class', 'flagged');
                targetCell.innerHTML = String.fromCodePoint(0x1F6A9);
            }
                
            if (!cell.isClicked && !cell.isFlagged) {
                targetCell.setAttribute('class', 'unclicked');
                targetCell.innerHTML = '';
            }

            //Reveal all mines as flagged.
            if (winner === 'W') {
                if (cell.isMine) {
                    targetCell.setAttribute('class', 'flagged');
                    targetCell.innerHTML = String.fromCodePoint(0x1F6A9);
                    board
                }
            }

            //Reveal all mines as exploded.
            if (winner === 'L') {
                if (cell.isMine) {
                    targetCell.setAttribute('class', 'mine');
                    targetCell.innerHTML = String.fromCodePoint(0x1F4A3);
                }
            }
        })
    })
    
    renderMessage();
}

function checkGameState() {
    let allSquaresChecked = true;

    board.forEach(function(row) {
        row.forEach(function(cell) {

            //Check that no cell is an unclicked mine or unclicked cell.
            if (!((cell.isClicked && !cell.isMine) || (!cell.isClicked && cell.isMine)))
                allSquaresChecked = false;
        })
    })

    return allSquaresChecked ? 'W' : 'N';
}

function renderMessage() {
    if (winner === 'W') {
        emojiEl.innerHTML = String.fromCodePoint(0x1F60E);
    } else if (winner === 'N') {
        emojiEl.innerHTML = String.fromCodePoint(0x1F643);
    } else if (winner === 'L') {
        emojiEl.innerHTML = String.fromCodePoint(0x1F480);
    }
}

function fetchEventInfo(evt) {
    let targetCell = evt.target;
    let row = targetCell.parentNode.rowIndex;
    let col = targetCell.cellIndex;

    return clickedCellObj = board[row][col];
}

function handleLeftClick(event) {
    //Prevent clicking if the game is over.
    if (!isPlaying) return;

    let clickedCellObj = fetchEventInfo(event);

    //Disable ability to left click a flagged cell.
    if (clickedCellObj.isFlagged) return;
    
    if (clickedCellObj.isMine) {
        // Game over
        winner = 'L';
        isPlaying = false;
        render();
        return;
    }

    checkAdjacentCells(clickedCellObj);

    winner = checkGameState();
    render();
}

function checkAdjacentCells(currCellObj) {
    let minesFound = 0;
    currCellObj.isClicked = true;

    //Row and column values as stored in object.
    let r = currCellObj.rowPos;
    let c = currCellObj.colPos;

    //Check the adjacent cells for mines.  If a mine is found, increment minesFound.
    for (let i = Math.max(r-1, 0); i <= Math.min(r+1, ROWS-1); i++) {
        for (let j = Math.max(c-1, 0); j <= Math.min(c+1, COLS-1); j++) {

            let neighborCellObj = board[i][j];

            if (neighborCellObj.isMine) {
                minesFound++;
            }
        }
    }
    
    //Assign the object the number of mines surrounding it.
    currCellObj.closeMines = minesFound;

    //If no mines were found at the current click,
    if (!currCellObj.closeMines) {
        for (let i = Math.max(r-1, 0); i <= Math.min(r+1, ROWS-1); i++) {
            for (let j = Math.max(c-1, 0); j <= Math.min(c+1, COLS-1); j++) {
                
                let neighborCellObj = board[i][j];

                //Check neighbors recursively
                if (!neighborCellObj.isClicked && !neighborCellObj.isFlagged) {
                    checkAdjacentCells(neighborCellObj);
                }
            }
        }
    }
}

function handleRightClick(event) {
    //Prevent clicking if the game is over.
    if(!isPlaying) return;

    event.preventDefault();

    let clickedCellObj = fetchEventInfo(event);

    //Disable ability to flag a clicked cell.
    if (clickedCellObj.isClicked) return;

    //If the cell is not flagged, change obj.isFlagged to true.
    clickedCellObj.isFlagged === false ?
        clickedCellObj.isFlagged = true : clickedCellObj.isFlagged = false;

    render();
}

function buildBoard(ROWS, COLS) {
    //Build grid in HTML
    for (let i = 0; i < ROWS; i++) {
        let row = boardEl.insertRow(i);
        
        for(let j = 0; j < COLS; j++) {
            let cell = row.insertCell(j);

            cell.setAttribute('class', 'unclicked');
        }
    }
}

function layMines(MINES) {
    for (let i = 0; i < MINES; i++) {
        let row = Math.floor(Math.random() * ROWS);
        let col = Math.floor(Math.random() * COLS);

        //Grab the cell object at the randomly generated position
        let cellObj = board[row][col];

        //If already true, decrement count so a new number is generated.
        if (cellObj.isMine === true) i--;

        cellObj.isMine = true;
    }
}

function handleResetClick() {
    init();
}