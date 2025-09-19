//2 Players Tic Tac Toe
//when user clicks start game button, the game starts
//the game starts by letting player 1 with symbol X choose a cell, then player 2 with symbol O chooses a cell
//when clicking a cell, the cell displays the current player's symbol
//a score is kept for each player, and the game ends when one player has won
//any player can reset the game by clicking the reset button
//the game is won when a player has 3 symbols in a row (horizontally, vertically, or diagonally)
//the game is a draw when no player has 3 symbols in a row and no more symbols can be placed
//win condition is if cells 1,2,3 or 1,4,7 or 2,5,8 or 3,6,9 are filled with the same player symbol
//Gonna build this project's JS files using factory functions and module pattern IIFEs

const Gameboard = (() => {
            let board = ['', '', '', '', '', '', '', '', ''];
            
            const getBoard = () => [...board];
            
            const setMark = (index, mark) => {
                if (index >= 0 && index < 9 && board[index] === '') {
                    board[index] = mark;
                    return true;
                }
                return false;
            };
            
            const getMark = (index) => board[index];
            
            const isCellEmpty = (index) => board[index] === '';
            
            const reset = () => {
                board = ['', '', '', '', '', '', '', '', ''];
            };
            
            const isFull = () => board.every(cell => cell !== '');
            
            return {
                getBoard,
                setMark,
                getMark,
                isCellEmpty,
                reset,
                isFull
            };
        })();

        // Player Factory
        const Player = (name, mark) => {
            let wins = 0;
            
            const getName = () => name;
            const getMark = () => mark;
            const getWins = () => wins;
            const addWin = () => wins++;
            const resetWins = () => wins = 0;
            
            return {
                getName,
                getMark,
                getWins,
                addWin,
                resetWins
            };
        };

        // Game Controller Module (IIFE - Single instance)
        const GameController = (() => {
            let players = [];
            let currentPlayerIndex = 0;
            let gameActive = false;
            let ties = 0;
            
            const winningCombinations = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6]             // Diagonals
            ];
            
            const initializePlayers = (name1, name2) => {
                players = [
                    Player(name1 || 'Player 1', 'X'),
                    Player(name2 || 'Player 2', 'O')
                ];
                currentPlayerIndex = 0;
                gameActive = true;
            };
            
            const getCurrentPlayer = () => players[currentPlayerIndex];
            
            const switchPlayer = () => {
                currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
            };
            
            const makeMove = (index) => {
                if (!gameActive) return false;
                
                const currentPlayer = getCurrentPlayer();
                const success = Gameboard.setMark(index, currentPlayer.getMark());
                
                if (success) {
                    const result = checkGameEnd();
                    if (result) {
                        gameActive = false;
                        if (result === 'win') {
                            currentPlayer.addWin();
                        } else if (result === 'tie') {
                            ties++;
                        }
                        return result;
                    }
                    switchPlayer();
                    return 'continue';
                }
                return false;
            };
            
            const checkGameEnd = () => {
                const board = Gameboard.getBoard();
                
                // Check for win
                for (let combination of winningCombinations) {
                    const [a, b, c] = combination;
                    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                        return 'win';
                    }
                }
                
                // Check for tie
                if (Gameboard.isFull()) {
                    return 'tie';
                }
                
                return null;
            };
            
            const getGameState = () => ({
                players: players.map(p => ({
                    name: p.getName(),
                    mark: p.getMark(),
                    wins: p.getWins()
                })),
                currentPlayer: getCurrentPlayer() ? {
                    name: getCurrentPlayer().getName(),
                    mark: getCurrentPlayer().getMark()
                } : null,
                gameActive,
                ties
            });
            
            const startNewGame = () => {
                Gameboard.reset();
                currentPlayerIndex = 0;
                gameActive = true;
            };
            
            const resetAll = () => {
                Gameboard.reset();
                players.forEach(player => player.resetWins());
                ties = 0;
                currentPlayerIndex = 0;
                gameActive = false;
            };
            
            return {
                initializePlayers,
                makeMove,
                getGameState,
                startNewGame,
                resetAll
            };
        })();

        // Display Controller Module (IIFE - Single instance)
        const DisplayController = (() => {
            const setupSection = document.getElementById('setup');
            const gameSection = document.getElementById('game');
            const startButton = document.getElementById('start-game');
            const restartButton = document.getElementById('restart-game');
            const resetButton = document.getElementById('reset-all');
            const player1Input = document.getElementById('player1-name');
            const player2Input = document.getElementById('player2-name');
            const gameInfo = document.getElementById('game-info');
            const gameResult = document.getElementById('game-result');
            const gameboard = document.getElementById('gameboard');
            const cells = document.querySelectorAll('.cell');
            const player1ScoreName = document.getElementById('player1-score-name');
            const player2ScoreName = document.getElementById('player2-score-name');
            const player1Score = document.getElementById('player1-score');
            const player2Score = document.getElementById('player2-score');
            const tiesScore = document.getElementById('ties-score');
            
            const showGameSection = () => {
                setupSection.classList.add('hidden');
                gameSection.classList.remove('hidden');
            };
            
            const showSetupSection = () => {
                setupSection.classList.remove('hidden');
                gameSection.classList.add('hidden');
            };
            
            const updateGameInfo = (message) => {
                gameInfo.textContent = message;
            };
            
            const updateGameResult = (message, type = '') => {
                gameResult.textContent = message;
                gameResult.className = `game-result ${type}`;
            };
            
            const renderBoard = () => {
                const board = Gameboard.getBoard();
                cells.forEach((cell, index) => {
                    cell.textContent = board[index];
                    cell.className = `cell ${board[index].toLowerCase()}`;
                });
            };
            
            const updateScoreboard = () => {
                const gameState = GameController.getGameState();
                if (gameState.players.length > 0) {
                    player1ScoreName.textContent = gameState.players[0].name;
                    player2ScoreName.textContent = gameState.players[1].name;
                    player1Score.textContent = gameState.players[0].wins;
                    player2Score.textContent = gameState.players[1].wins;
                    tiesScore.textContent = gameState.ties;
                }
            };
            
            const handleCellClick = (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const gameState = GameController.getGameState();
                
                if (!gameState.gameActive) return;
                
                const result = GameController.makeMove(index);
                
                if (result) {
                    renderBoard();
                    const newGameState = GameController.getGameState();
                    
                    if (result === 'win') {
                        updateGameResult(`🎉 ${newGameState.players.find(p => p.mark === newGameState.currentPlayer.mark).name} wins!`, 'winner');
                        updateGameInfo('Game Over!');
                    } else if (result === 'tie') {
                        updateGameResult(`🤝 It's a tie!`, 'tie');
                        updateGameInfo('Game Over!');
                    } else {
                        const currentPlayer = newGameState.currentPlayer;
                        updateGameInfo(`${currentPlayer.name}'s turn (${currentPlayer.mark})`);
                        updateGameResult('');
                    }
                    
                    updateScoreboard();
                }
            };
            
            const handleStartGame = () => {
                const player1Name = player1Input.value.trim() || 'Player 1';
                const player2Name = player2Input.value.trim() || 'Player 2';
                
                GameController.initializePlayers(player1Name, player2Name);
                GameController.startNewGame();
                
                showGameSection();
                renderBoard();
                updateScoreboard();
                
                const gameState = GameController.getGameState();
                updateGameInfo(`${gameState.currentPlayer.name}'s turn (${gameState.currentPlayer.mark})`);
                updateGameResult('');
            };
            
            const handleRestartGame = () => {
                GameController.startNewGame();
                renderBoard();
                updateScoreboard();
                
                const gameState = GameController.getGameState();
                updateGameInfo(`${gameState.currentPlayer.name}'s turn (${gameState.currentPlayer.mark})`);
                updateGameResult('');
            };
            
            const handleResetAll = () => {
                GameController.resetAll();
                showSetupSection();
                player1Input.value = '';
                player2Input.value = '';
                updateGameResult('');
            };
            
            // Event Listeners
            const init = () => {
                startButton.addEventListener('click', handleStartGame);
                restartButton.addEventListener('click', handleRestartGame);
                resetButton.addEventListener('click', handleResetAll);
                
                cells.forEach(cell => {
                    cell.addEventListener('click', handleCellClick);
                });
                
                // Allow Enter key to start game
                [player1Input, player2Input].forEach(input => {
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            handleStartGame();
                        }
                    });
                });
            };
            
            return { init };
        })();

        // Initialize the game when DOM is loaded
        document.addEventListener('DOMContentLoaded', DisplayController.init);
    