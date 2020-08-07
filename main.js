/*----- constants -----*/
const ROWS = 7;
const COLS = 7;

const overlord = {
    'null': 'gray',
    'flagged': 'yellow',
    'safe': 'green',
};

/*----- app's state (variables) -----*/
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
    winner = null;

    renderBoard();
}

function renderBoard() {

    board.forEach(function(el, idx) {
        let squareEls = document.createElement('div');
        squareEls.className = 'square';
        squareEls.id = idx;
        boardEl.appendChild(squareEls);
        squareEls.style.backgroundColor = overlord[el];
    })

    //  board.forEach(function(row) {
    //      row.forEach(function(square, idx) {
    //         let squareEls = document.createElement('div');
    //         squareEls.className = 'square';
    //         boardEl.appendChild(squareEls);
    //      })
    //  });
}