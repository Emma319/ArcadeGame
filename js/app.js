/**
 * Classes create objects like player, enemy, gemstone, rock
 */
/**
 * @classdesc Entity class for bacis variables and methods
 */
class Entity {
    /**
     * Create a Entity.
     */
    constructor() {
        this.sprite = 'images/';
        // Setting the Entity initial location
        this.xstep = 101;
        this.ystep = 83;
        this.xstart = -1 * this.xstep;
        this.ystart = -1 * this.ystep;
        this.x = this.xstart;
        this.y = this.ystart;
    }

    /**
     * @description Draw the entity on the screen, required method for game
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /**
     * @description Check if entity hit the boundary or rock
     */
    update() {
        this.leftboundary = this.x <= 0;
        this.topboundary = this.y <= 0;
        this.rightboundary = this.x >= 404;
        this.downboundary = this.y >= 395;

        this.leftbarrier = false;
        this.topbarrier = false;
        this.rightbarrier = false;
        this.downbarrier = false;
    }
}

/**
 * @classdesc Player class handles movement and resets start location.
 * @extends Entity
 */
class Player extends Entity {
    /**
     * Create a Player.
     */
    constructor() {
        super();
        // The image/sprite for player
        this.sprite += 'char-horn-girl.png';
        // Setting the Player initial location
        this.xAxis = 2;
        this.yAxis = 5;
        this.xstart = this.xstep  * 2;
        this.ystart = this.ystep * 5 - 20;
        this.x = this.xstart;
        this.y = this.ystart;
    }

    /**
     * @description Update player position
     */
    update() {
        super.update();
        this.xAxis = this.x / this.xstep;
        this.yAxis = (this.y + 20) / this.ystep;

        /**
         * @description Check if player reach the other side
         */
        if (this.topboundary) {
            updateScores(50);
            updateLevels();
            resetEnemy();
            this.x = this.xstart;
            this.y = this.ystart;
        }

        /**
         * @description Check if there is a rock barrier on level 3
         */
        if(levels === 3) {
            switch(this.xAxis) {
                case (0):
                    if (this.yAxis === 2) { this.rightbarrier = true; }
                    break;

                case (1):
                    if (this.yAxis === 3) { this.topbarrier = true; }
                    if (this.yAxis === 4) { this.rightbarrier = true; }
                    if (this.yAxis === 1) { this.downbarrier = true; }
                    break;

                case (2):
                    if (this.yAxis === 2) { this.leftbarrier = true; }
                    if (this.yAxis === 5) { this.topbarrier = true; }
                    if (this.yAxis === 3) { this.rightbarrier = true; }
                    if (this.yAxis === 3) { this.downbarrier = true; }
                    break;

                case (3):
                    if (this.yAxis === 4) { this.leftbarrier = true; }
                    if (this.yAxis === 4) { this.topbarrier = true; }
                    if (this.yAxis === 2) { this.rightbarrier = true; }
                    if (this.yAxis === 2) { this.downbarrier = true; }
                    break;

                case (4):
                    if (this.yAxis === 3) { this.leftbarrier = true; }
                    if (this.yAxis === 3) { this.topbarrier = true; }
                    if (this.yAxis === 2) { this.rightbarrier = true; }
                    if (this.yAxis === 1) { this.downbarrier = true; }
                    break;

                default:
                    break;
            }
        }
    }

    /**
     * @description Handle movement of player around the board
     */
    handleInput(input) {
        switch(input) {
            case 'left':
                this.x = this.leftboundary || this.leftbarrier ? this.x : this.x - this.xstep;
                break;

            case 'up':
                this.y = this.topboundary || this.topbarrier ? this.y : this.y - this.ystep;
                break;

            case 'right':
                this.x = this.rightboundary || this.rightbarrier ? this.x : this.x + this.xstep;
                break;

            case 'down':
                this.y = this.downboundary || this.downbarrier ? this.y : this.y + this.ystep;
                break;
        }
    }
}

/**
 * @classdesc Enemy class handles location update and collision
 * @extends Entity
 */
class Enemy extends Entity {
    /**
     * Create a Enemy.
     * @param {number} y - enemy's y-index
     */
    constructor(y) {
        super();
        // The image/sprite for enemies
        this.sprite += 'enemy-bug.png';
        // Setting the Enemy initial location
        this.xstart = -1 * this.xstep;
        this.ystart = y * this.ystep - 20;
        this.x = this.xstart;
        this.y = this.ystart;
        // Setting the Enemy speed
        this.speed = Math.floor(Math.random() * 500);
    }

    /**
     * @description Update enemy position
     * @param {number} dt - time delta
     */
    update(dt) {
        super.update();

        /**
         * @description Updates the Enemy location
         */
        this.x += this.speed * dt;
        if (this.x > 505) {
            this.x = this.xstart;
            this.speed = Math.floor(Math.random() * 500);
        }

        /**
         * @description Handles collision with the Player
         */
        if (this.y === player.y &&
            this.x > player.x - 80 &&
            this.x < player.x + 80) {
            player.x = player.xstart;
            player.y = player.ystart;
            updateLives();
        }
    }
}

/**
 * @classdesc Gem class handles collection of gemstones
 * @extends Entity
 */
class Gem extends Entity {
    /**
     * Create a Gem.
     * @param {string} i - path of image file
     */
    constructor(i) {
        super();
        // The image/sprite for gemstones
        this.sprite += i;
    }

    /**
     * @description Draw the gemstone on the screen, required method for game
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 135);
    }

    /**
     * @description Update gemstones position
     */
    update() {
        super.update();

        /**
         * @description Handles collection by the Player
         */
        if (this.y - 20 === player.y && this.x - 10 === player.x) {
            this.x = this.xstart;
            this.y = this.ystart;
            if (this.sprite === 'images/gem-orange.png') {
                updateScores(250); // gem-organge has 250 scores
            } else {
                updateScores(200); // other gem has 200 scores
            }
        }
    }
}

/**
 * @classdesc Rock class for level 3
 * @extends Entity
 */
class Rock extends Entity {
    /**
     * Create a Rock.
     */
    constructor() {
        super();
        // The image/sprite for rocks
        this.sprite += 'Rock.png';
    }

    /**
     * @description Draw the rock on the screen, required method for game
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 95, 160);
    }
}

/**
 * This listens for key presses and sends the keys to
 * Player.handleInput() method. Also handles game start or over.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'start'
    };

    // Arrow keys only work when game is started but not over yet
    if (gameStart && !gameOver) {
        player.handleInput(allowedKeys[e.keyCode]);
    }

    // Press enter key to start the game and timer when game is not started
    if (allowedKeys[e.keyCode] === 'start' && !gameStart) {
        gameStart = true;
        countdownTimer(timer);
        resetEnemy();
        sound.play();
        sound.rate(0.8);
    }

    // Press enter key to restart the game when game is over
    if (allowedKeys[e.keyCode] === 'start' && gameOver) {
        gameStart = false;
        restart();
        sound.stop();
        soundOver.stop();
        soundWin.stop();
    }
});


/**
 * Functions handle lives, scores, levels, and timer
 */
/**
 * @description Update lives and show heart symbol on score panel
 */
function updateLives() {
    lives -= 1;
    // sound effect for live lose
    soundBug.play();
    switch(lives) {
        case 3:
            heartTag[2].className = "fa fa-heart";
            heartTag[1].className = "fa fa-heart";
            heartTag[0].className = "fa fa-heart";
            break;

        case 2:
            heartTag[2].className = "fa fa-heart-o";
            break;

        case 1:
            heartTag[1].className = "fa fa-heart-o";
            break;

        case 0:
            heartTag[0].className = "fa fa-heart-o";
            // call game over function
            gameEnd();
            // sound effect for game over
            sound.stop();
            soundOver.play();
            break;
    }
}

/**
 * @description Update scores and show score on score panel
 * @param {number} n - the score player gain
 */
function updateScores(n) {
    scores += n;
    scoreTag.textContent = scores;
    // sound effect for score earn
    soundScore.play();
}

/**
 * @description Update and show level on score panel. Also call level function
 */
function updateLevels() {
    levels += 1;

    switch(levels) {
        case 1:
            levelTag.textContent = levels;
            level1();
            break;

        case 2:
            levelTag.textContent = levels;
            level2();
            // sound effect for level up
            sound.rate(1.2);
            break;

        case 3:
            levelTag.textContent = levels;
            level3();
            // sound effect for level up
            sound.rate(1.6);
            break;

        case 4:
            gameEnd();
            gameWon();
            // sound effect for game win
            sound.stop();
            soundWin.play();
            break;
    }
}

/**
 * @description Update gemstones and rocks location for level 1
 */
function level1() {
    allGems.forEach(function(gem) {
            gem.x = gem.xstart;
            gem.y = gem.ystart;
    });
    allRocks.forEach(function(rock) {
            rock.x = rock.xstart;
            rock.y = rock.ystart;
    });
}

/**
 * @description Update gemstones and rocks location for level 2
 */
function level2() {
    allGems[0].x = allGems[0].xstep * Math.floor(Math.random() * 5) + 10;
    allGems[0].y = allGems[0].ystep * (Math.floor(Math.random() * 2) + 1);
    allGems[1].x = allGems[1].xstep * Math.floor(Math.random() * 5) + 10;
    allGems[1].y = allGems[1].ystep * (Math.floor(Math.random() * 2) + 3);
}

/**
 * @description Update gemstones and rocks location for level 3
 */
function level3() {
    allGems[0].x = allGems[0].xstart;
    allGems[0].y = allGems[0].ystart;
    allGems[1].x = allGems[1].xstart;
    allGems[1].y = allGems[1].ystart;
    allGems[2].x = allGems[2].xstep * 0 + 10;
    allGems[2].y = allGems[2].ystep * 1;
    allGems[3].x = allGems[3].xstep * 4 + 10;
    allGems[3].y = allGems[3].ystep * 3;

    allRocks[0].x = allRocks[0].xstep * 1;
    allRocks[0].y = allRocks[0].ystep * 2 - 20;
    allRocks[1].x = allRocks[1].xstep * 2;
    allRocks[1].y = allRocks[1].ystep * 4 - 20;
    allRocks[2].x = allRocks[2].xstep * 3;
    allRocks[2].y = allRocks[2].ystep * 3 - 20;
    allRocks[3].x = allRocks[3].xstep * 4;
    allRocks[3].y = allRocks[3].ystep * 2 - 20;
}

/**
 * @description Create a Countdown Timer
 * @class
 * @param {object} timer - countdown
 */
function countdownTimer(timer) {
    timer.start({countdown: true, startValues: {seconds: 30}});

    timeTag.textContent = timer.getTimeValues().toString(["seconds"]);

    timer.addEventListener("secondsUpdated", function (e) {
        timeTag.textContent = timer.getTimeValues().toString(["seconds"]);
    });

    timer.addEventListener("targetAchieved", function (e) {
        timeTag.textContent = "TIME UP!!";
        // call game over function
        gameEnd();
        // sound effect for game over
        sound.stop();
        soundOver.play();
    });
}


/**
 * Functions handle game start, over, and reset
 */
/**
 * @description Reset enemy location (y-index)
 */
function resetEnemy() {
    allEnemies.length = 0;
    for (let i = 1; i <= 4; i++) {
        allEnemies.push(new Enemy(i));
    }
    let y = Math.floor(Math.random() *4) + 1;
    allEnemies.push(new Enemy(y));
}

/**
 * @description Game win
 */
function gameWon() {
    console.log('Congratuation!! You Win!!');
}

/**
 * @description Game over and stop the timer
 */
function gameEnd() {
    console.log('Game Over!!');
    gameOver = true;
    timer.stop();
}

/**
 * @description Restart a game and reset objects and variables
 */
function restart() {
    console.log('Restart Game!!');

    // reset all objects to start location
    resetEnemy();

    player.x = player.xstart;
    player.y = player.ystart;

    allGems.forEach(function(gem) {
        gem.x = gem.xstart;
        gem.y = gem.ystart;
    });

    allRocks.forEach(function(rock) {
        rock.x = rock.xstart;
        rock.y = rock.ystart;
    });

    // reset leves, scores, levels to default value
    lives = 3;
    heartTag[2].className = "fa fa-heart";
    heartTag[1].className = "fa fa-heart";
    heartTag[0].className = "fa fa-heart";

    scores = 0;
    scoreTag.textContent = scores;

    levels = 1;
    levelTag.textContent = levels;
}



/**
 * Instantiate player, enemy, gemstone, and rock objects
 */
// Player object
const player = new Player();

// Enemy objects in an array called allEnemies
let allEnemies = [];

// Gemstone objects in an arrary called allGems
let allGems = [];
const gemImgs = ['gem-blue.png', 'gem-green.png',
                             'gem-green.png', 'gem-orange.png'];
for (let i = 0; i < 4; i++) {
    allGems.push(new Gem(gemImgs[i]));
}

// Rock objects in an array called allRocks
let allRocks = [];
for (let i = 1; i <= 4; i++) {
    allRocks.push(new Rock());
}


/**
 * Variables for lives, scores, levels, and timer
 */
let gameStart = false;
let gameOver = false;
let lives = 3;
let scores = 0;
let levels = 1;
let timer = new Timer();
const heartTag = document.querySelectorAll(".fa-heart");
const scoreTag = document.querySelector(".scores");
const levelTag = document.querySelector(".levels");
const timeTag = document.querySelector(".timer");

/**
 * Variables for sound effects
 */
var sound = new Howl({ src: ['./audio/sound.mp3'] });
var soundBug = new Howl({ src: ['./audio/bug.mp3'] });
var soundScore = new Howl({ src: ['./audio/score.mp3'] });
var soundOver = new Howl({ src: ['./audio/over.mp3'] });
var soundWin = new Howl({ src: ['./audio/win.mp3'] });
