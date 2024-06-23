document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');
    const messageBox = document.getElementById('messageBox');
    const messageImage = document.getElementById('messageImage');
    const messageText = document.getElementById('messageText');
    const closeButton = document.getElementById('closeButton');
    const scoreElement = document.querySelector('.score');
    let dino, obstacles, gameInterval, obstacleCount;
    let gameStarted = false;

    function startGame() {
        dino = {
            x: 175,
            y: canvas.height - 80,
            width: 50,
            height: 50,
            sprite: new Image()
        };
        dino.sprite.src = 'dino.png';

        obstacles = [];
        obstacleCount = 0;
        updateScore();

        leftButton.addEventListener('click', () => {
            moveLeft();
            if (!gameStarted) {
                gameStarted = true;
                gameInterval = setInterval(gameLoop, 1000 / 60);
            }
        });
        
        rightButton.addEventListener('click', () => {
            moveRight();
            if (!gameStarted) {
                gameStarted = true;
                gameInterval = setInterval(gameLoop, 1000 / 60);
            }
        });

        closeButton.addEventListener('click', restartGame);
    }

    function moveLeft() {
        dino.x -= 20;
        if (dino.x < 0) dino.x = 0;
    }

    function moveRight() {
        dino.x += 20;
        if (dino.x + dino.width > canvas.width) dino.x = canvas.width - dino.width;
    }

    function gameLoop() {
        update();
        draw();
        checkCollision();
    }

    function update() {
        if (Math.random() < 0.02) {
            obstacles.push({
                x: Math.random() * (canvas.width - 50),
                y: 0,
                width: 50,
                height: 50,
                sprite: new Image()
            });
            obstacles[obstacles.length - 1].sprite.src = 'obstacle.png';
        }

        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].y += 5;
            if (obstacles[i].y > canvas.height) {
                obstacles.splice(i, 1);
                obstacleCount++;
                updateScore();
                if (obstacleCount >= 25) {
                    winGame();
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(dino.sprite, dino.x, dino.y, dino.width, dino.height);
        for (let i = 0; i < obstacles.length; i++) {
            ctx.drawImage(obstacles[i].sprite, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        }
    }

    function checkCollision() {
        for (let i = 0; i < obstacles.length; i++) {
            if (
                dino.x < obstacles[i].x + obstacles[i].width &&
                dino.x + dino.width > obstacles[i].x &&
                dino.y < obstacles[i].y + obstacles[i].height &&
                dino.height + dino.y > obstacles[i].y
            ) {
                loseGame();
            }
        }
    }

    function loseGame() {
        clearInterval(gameInterval);
        messageImage.src = 'lose.png';
        messageText.textContent = 'Perdiste porque no me quieres!! :(';
        messageBox.classList.remove('hidden');
    }

    function winGame() {
        clearInterval(gameInterval);
        messageImage.src = 'win.png';
        messageText.textContent = 'Te quiero 10000000000000000000% (elevado al cubo)';
        messageBox.classList.remove('hidden');
    }

    function updateScore() {
        scoreElement.textContent = `Puntaje: ${obstacleCount} / 25`;
    }

    function restartGame() {
        messageBox.classList.add('hidden');
        dino.x = 175;
        obstacles = [];
        obstacleCount = 0;
        updateScore();
        gameStarted = false;
    }

    startGame();
});
