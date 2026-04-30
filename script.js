// Tic Tac Toe Game - Pure JavaScript
class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.init();
    }

    init() {
        this.createBoard();
        this.updateStatus();
        this.bindEvents();
        this.createStyles();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
            }
            .game-container {
                text-align: center;
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 2rem;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.2);
            }
            h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                background: linear-gradient(45deg, #fff, #f0f0f0);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .status { font-size: 1.3rem; margin-bottom: 2rem; font-weight: 500; }
            .board {
                display: grid;
                grid-template-columns: repeat(3, 120px);
                grid-template-rows: repeat(3, 120px);
                gap: 10px;
                margin: 0 auto 2rem;
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 20px;
                box-shadow: inset 0 10px 30px rgba(0,0,0,0.2);
            }
            .cell {
                background: rgba(255,255,255,0.9);
                border: none;
                border-radius: 15px;
                font-size: 3.5rem;
                font-weight: bold;
                color: #333;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
                box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            }
            .cell:hover {
                transform: translateY(-5px) scale(1.05);
                box-shadow: 0 15px 35px rgba(0,0,0,0.3);
                background: rgba(255,255,255,1);
            }
            .cell.x { color: #e74c3c; }
            .cell.o { color: #3498db; }
            .btn {
                padding: 12px 24px;
                font-size: 1rem;
                font-weight: 600;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                text-transform: uppercase;
                letter-spacing: 1px;
                background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                color: white;
            }
            .btn:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(255,107,107,0.4); }
            .modal {
                display: none;
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0,0,0,0.8);
                backdrop-filter: blur(10px);
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            .modal-content {
                position: absolute;
                top: 50%; left: 50%;
                transform: translate(-50%,-50%) scale(0.7);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 3rem 2rem;
                border-radius: 30px;
                text-align: center;
                box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                border: 2px solid rgba(255,255,255,0.3);
                max-width: 400px;
                animation: popupIn 0.5s cubic-bezier(0.68,-0.55,0.265,1.55) 0.2s forwards;
            }
            .winner-title {
                font-size: 2.5rem;
                font-weight: 800;
                margin-bottom: 1rem;
                background: linear-gradient(45deg, #fff, #ffd700);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 0 0 30px rgba(255,255,255,0.5);
            }
            .winner-subtitle { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
            .celebration { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; pointer-events: none; overflow: hidden; }
            .particle {
                position: absolute;
                width: 8px; height: 8px;
                background: #ffd700;
                border-radius: 50%;
                animation: explode 1s ease-out forwards;
            }
            .restart-btn {
                padding: 15px 40px;
                font-size: 1.1rem;
                background: linear-gradient(45deg, #ffd700, #ffed4e);
                color: #333;
                border: none;
                border-radius: 50px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 10px 25px rgba(255,215,0,0.4);
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .restart-btn:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 20px 40px rgba(255,215,0,0.6);
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes popupIn { to { transform: translate(-50%,-50%) scale(1); opacity: 1; } }
            @keyframes explode {
                0% { transform: translate(0,0) scale(0); opacity: 1; }
                100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
            }
            @media (max-width: 600px) {
                .board { grid-template-columns: repeat(3,90px); grid-template-rows: repeat(3,90px); gap: 8px; padding: 15px; }
                .cell { font-size: 2.5rem; }
                h1 { font-size: 2rem; }
            }
        `;
        document.head.appendChild(style);
    }

    createBoard() {
        const container = document.createElement('div');
        container.className = 'game-container';
        container.innerHTML = `
            <h1>🎮 Tic Tac Toe</h1>
            <div class="status" id="status">Player X's turn</div>
            <div class="board" id="board"></div>
            <div class="controls">
                <button class="btn" id="resetBtn">🔄 Reset Game</button>
            </div>
        `;
        document.body.innerHTML = '';
        document.body.appendChild(container);

        const board = document.getElementById('board');
        board.innerHTML = '';
        this.board.forEach((_, index) => {
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.dataset.index = index;
            cell.addEventListener('click', () => this.makeMove(index));
            board.appendChild(cell);
        });

        this.createModal();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="celebration" id="celebration"></div>
                <div class="winner-title" id="winnerTitle">Player X Wins!</div>
                <div class="winner-subtitle" id="winnerSubtitle">Congratulations! 🎉</div>
                <button class="restart-btn" id="restartModalBtn">Play Again</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    bindEvents() {
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('restartModalBtn').addEventListener('click', () => this.reset());
    }

    makeMove(index) {
        if (!this.gameActive || this.board[index]) return;

        this.board[index] = this.currentPlayer;
        this.updateBoard();
        if (this.checkWinner()) {
            this.endGame(`${this.currentPlayer} Wins!`);
        } else if (this.board.every(cell => cell)) {
            this.endGame("It's a Draw!");
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatus();
        }
    }

    updateBoard() {
        document.querySelectorAll('.cell').forEach((cell, index) => {
            cell.textContent = this.board[index];
            cell.className = 'cell';
            if (this.board[index]) {
                cell.classList.add(this.board[index].toLowerCase());
            }
        });
    }

    updateStatus() {
        document.getElementById('status').textContent = 
            this.gameActive ? `Player ${this.currentPlayer}'s turn` : '';
    }

    checkWinner() {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
        return winPatterns.some(pattern => 
            pattern.every(index => this.board[index] === this.currentPlayer)
        );
    }

    endGame(message) {
        this.gameActive = false;
        this.showModal(message);
    }

    reset() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.updateBoard();
        this.updateStatus();
        document.getElementById('modal').style.display = 'none';
    }

    showModal(message) {
        const modal = document.getElementById('modal');
        const title = document.getElementById('winnerTitle');
        const subtitle = document.getElementById('winnerSubtitle');
        
        title.textContent = message;
        subtitle.textContent = message.includes('Draw') ? 'Good game! 🤝' : 'Congratulations! 🎉';
        
        modal.style.display = 'block';
        this.createParticles();
    }

    createParticles() {
        const celebration = document.getElementById('celebration');
        celebration.innerHTML = '';
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 150 + Math.random() * 100;
            particle.style.setProperty('--dx', `${Math.cos(angle) * velocity}px`);
            particle.style.setProperty('--dy', `${Math.sin(angle) * velocity - 200}px`);
            particle.style.animationDelay = `${Math.random() * 0.3}s`;
            celebration.appendChild(particle);
        }
    }
}

// Initialize the game
const game = new TicTacToe();