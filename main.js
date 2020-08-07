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
let board = [ [] ];

/*----- cached element references -----*/
const boardEl = document.getElementById('main-grid');

/*----- event listeners -----*/


/*----- functions -----*/
init();

function init() {
    board = Array(ROWS).fill().map( () => Array(COLS).fill(null));
    winner = null;

    // renderBoard();
}

function renderBoard() {

    // board.forEach(function(square, idx) {
    //     squareEls[idx].style.background = colors[square];
    // });
}