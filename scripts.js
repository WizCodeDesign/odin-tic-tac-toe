//2 Players Tic Tac Toe
//when user clicks start game button, the game starts
//the game starts by letting player 1 with symbol X choose a cell, then player 2 with symbol O chooses a cell
//when clicking a cell, the cell displays the current player's symbol
//a score is kept for each player, and the game ends when one player has won
//any player can reset the game by clicking the reset button
//the game is won when a player has 3 symbols in a row (horizontally, vertically, or diagonally)
//the game is a draw when no player has 3 symbols in a row and no more symbols can be placed
//win condition is if cells 1,2,3 or 1,4,7 or 2,5,8 or 3,6,9 are filled with the same player symbol

const game = {
    player1: 'X',
    player2: 'O',
    score1: 0,
    score2: 0,
    turn: 1,
    gameBoard: document.querySelector('.game-board'),
    cells: ["document.querySelector('#cell-1')", "document.querySelector('#cell-2')", "document.querySelector('#cell-3')"
        , "document.querySelector('#cell-4')", "document.querySelector('#cell-5')", "document.querySelector('#cell-6')",
         "document.querySelector('#cell-7')", "document.querySelector('#cell-8')", "document.querySelector('#cell-9')"],
    startGameBtn: document.querySelector('#start-game'),
    resetGameBtn: document.querySelector('#reset-game'),
        startGame: function () {},
        resetGame: function () {
            //change all innertext to empty string for each cell id in the cells array
            this.cells.forEach(cell => cell.innerText = '');
        },
        checkScore: function () {},
}
document.addEventListener('DOMContentLoaded', function () {

});