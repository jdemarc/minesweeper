# Minesweeper

## Getting Started

With some logic and luck, clear the board without detonating the mines! Click around and use the clues to achieve victory.  Left click to flag suspicious cells.  Feel free to create your own board from 2x2 to 10x10 and place up to 99 mines.  Set off a mine, and it's **game over**.

Don't try to break me with putting too many mines.  _It won't work!_

[Play here!](https://jdemarc.github.io/minesweeper/)

## Screenshots
After loading, the UI should appear as follows:

<img src='https://i.imgur.com/ndyFlTZ.png'>

> Start of game

The game begins with a click.  If you click on a safe cell, the number of adjacent mines will appear.  Safe cells with no adjacent mines (zero, 0) will recursively check their neighbors and reveal the number of surrounding mines.

<img src='https://i.imgur.com/j3B0kCP.png'>

> Adjacency checking

Cells can be flagged denoting you believe a mine exists at the given cell.  Flags are placed using a right click.  They can be removed by right clicking the cell again.

<img src='https://i.imgur.com/Y07gsPD.png'>

> Flagging cells

If you click on a cell containing a mine, the game ends.  The emoji at the top turns into a skull and all mines on the board are revealed.

<img src='https://i.imgur.com/4lV0W2A.png'>

> Game over

If you've cleared the board, the board will automatically flag all of the mines to reveal their positions.  The emoji at the top will throw on a pair of shades.  Congratulations! Click on the **emoji** or the **submit** button to reset the game.

> If you adjust the values below, they will not take effect until the submit button is pressed.

<img src='https://i.imgur.com/xIAw9cz.png'>

> Victory!

## Technology Used
- JavaScript
- HTML
- CSS

## Next Steps

Additional features to expand the game include...
- Flag indicator: indicate the number of flags used
- Preset difficulties: easy, medium, hard.
- Enhancing UI: style background according to number of adjacent mines
- Timer: add a timer to the game with that naturally resets and has the ability to be paused.
- Scoreboard: track recent completions and put them on a leaderboard