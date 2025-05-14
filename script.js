const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

const gridSize = 20;
let tileCountX = 20;
let tileCountY = 20;

canvas.width = gridSize * tileCountX;
canvas.height = gridSize * tileCountY;

let snake;
let food;
let velocity;
let score;
let gameInterval;
let isGameOver = true;

function initializeGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    velocity = { x: 0, y: 0 };
    score = 0;
    isGameOver = false;
    drawInitialState();
}

function startGame() {
    startButton.style.display = 'none';
    if (isGameOver) {
        initializeGame();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 1000 / 10);
    }
}

function gameLoop() {
    if (isGameOver) return;
    update();
    draw();
}

function update() {
    if (isGameOver) return;
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food.x = Math.floor(Math.random() * tileCountX);
        food.y = Math.floor(Math.random() * tileCountY);
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        gameOver();
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

function drawInitialState() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'green';
    if (snake && snake.length > 0) {
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
    }

    ctx.fillStyle = 'red';
    if (food) {
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + (score !== undefined ? score : 0), 10, canvas.height - 10);
}

function draw() {
    if (isGameOver && snake && food) {
        return;
    }
    if (!snake || !food) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, canvas.height - 10);
}

function gameOver() {
    isGameOver = true;
    if (gameInterval) clearInterval(gameInterval);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);
    startButton.textContent = 'Restart Game';
    startButton.style.display = 'block';
    ctx.textAlign = 'left';
}

function resetGame() {
    gameOver();
}

document.addEventListener('keydown', (event) => {
    if (isGameOver && !(velocity.x === 0 && velocity.y === 0)) return;
    if (isGameOver && velocity.x === 0 && velocity.y === 0 && snake && snake.length === 1) {
    } else if (isGameOver) {
        return;
    }
    switch (event.key) {
        case 'ArrowUp':
            if (velocity.y === 0) {
                velocity = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (velocity.y === 0) {
                velocity = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (velocity.x === 0) {
                velocity = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (velocity.x === 0) {
                velocity = { x: 1, y: 0 };
            }
            break;
    }
});

function setupInitialView() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    score = 0;
    velocity = {x: 0, y: 0};
    isGameOver = true;

    drawInitialState();

    startButton.textContent = 'Start Game';
    startButton.style.display = 'block';
}

setupInitialView();
startButton.addEventListener('click', startGame);
// gameLoop();

// Initialize the game view but don't start the loop
// initializeGame();
// drawInitialState();
// startButton.addEventListener('click', startGame);
// gameLoop(); 