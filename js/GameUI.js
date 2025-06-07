class GameUI {
    static updateScore(score) {
        document.getElementById('score').textContent = Math.floor(score / 10);
    }
    
    static updateCoins(coins) {
        document.getElementById('coins').textContent = coins;
    }
    
    static showGameOver(score, coins) {
        const gameOverElement = document.getElementById('gameOver');
        const gameContainer = document.getElementById('gameContainer');
        
        document.getElementById('finalScore').textContent = Math.floor(score / 10);
        document.getElementById('finalCoins').textContent = coins;
        
        // Efecto de sacudida en el contenedor
        gameContainer.classList.add('explosion-effect');
        setTimeout(() => {
            gameContainer.classList.remove('explosion-effect');
        }, 500);
        
        // Mostrar modal con efecto especial
        setTimeout(() => {
            gameOverElement.style.display = 'block';
            gameOverElement.classList.add('explosion-show');
        }, 300);
    }
    
    static hideGameOver() {
        const gameOverElement = document.getElementById('gameOver');
        gameOverElement.style.display = 'none';
        gameOverElement.classList.remove('show', 'explosion-show');
    }
    
    static addDisintegrationEffect() {
        const ui = document.getElementById('ui');
        ui.classList.add('disintegrating');
        setTimeout(() => {
            ui.classList.remove('disintegrating');
        }, 600);
    }
}