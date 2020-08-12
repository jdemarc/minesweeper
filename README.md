# Minesweeper

## Getting Started

With some logic and luck, clear the board without detonating the mines! Click around and use the clues to achieve victory.  Left click to flag suspicious cells.  Set off a mine, and it's **game over**.

*link to game here*

## Screenshots
After loading, the UI should appear as below:

<img src='https://i.imgur.com/BdOKOQM.png'>

> Start of game

Once you click, the game is started and the timer begins. If you click on a safe cell, the number of adjacent mines will appear.  Safe cells with no adjacent mines (zero, 0) will recursively check their neighbors.

<img src='https://i.imgur.com/Rs9iFie.png'>

> Adjacency checking

Cells can be flagged denoting you believe a mine exists at the given cell.  Flags are placed using a right click.

<img src='https://i.imgur.com/XTWwhAx.png'>

> Flagging cells

If you click on a cell containing a mine, the game ends and the timer stops.  The emoji at the top turns into a skull.  All mines on the board are revealed.

<img src='https://i.imgur.com/DPtZ1pR.png'>

> Game over

If you've cleared the board, the board will automatically flag all of the mines to reveal their positions.  The emoji at the top will throw on a pair of shades, and the time stops.  Congratulations! Click on the reset button to play again.

<img src='https://i.imgur.com/xU4XbOB.png'>

> Victory!

## Technology Used
- JavaScript
- HTML
- CSS

## Next Steps

Additional features to expand the game include...
- Flag indicator: indicate the number of flags used
- Difficulty levels: allow user to change between difficulties (easy, medium, hard) or allow user to customize board size and mine count
- Enhancing UI: style background according to number of adjacent mines
- Timer pausing: game may be paused
- Scoreboard: track recent completions and put them on a leaderboard


