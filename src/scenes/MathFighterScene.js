import Phaser from "phaser";

// importing class to create the score label
import ScoreLabel from "../ui/ScoreLabel.js";

export default class MathFighterScene extends Phaser.Scene {
	constructor() {
		super("math-fighter-scene");
	}

	init() {
		// getting half of the game screen's width and height to be used for positioning
		this.gameHalfWidth = this.scale.width * 0.5;
		this.gameHalfHeight = this.scale.height * 0.5;

		// for player hero and enemy objects
		this.player = undefined;
		this.enemy = undefined;

		// for the player's and enemy's slash
		this.slash = undefined;

		// to describe the state of the game
		this.startGame = false;

		// for question and answer texts, respectively
		this.questionText = undefined;
		this.resultText = undefined;

		// number buttons
		this.button1 = undefined;
		this.button2 = undefined;
		this.button3 = undefined;
		this.button4 = undefined;
		this.button5 = undefined;
		this.button6 = undefined;
		this.button7 = undefined;
		this.button8 = undefined;
		this.button9 = undefined;
		this.button0 = undefined;
		this.buttonDel = undefined;
		this.buttonOk = undefined;

		// storage for the entered numbers
		this.numberArray = [];
		this.number = 0;

		// storage for the math questions
		this.question = [];
		// question[0] stores the text to be printed
		// question[1] stores the result of the calculation

		// to describe the player's answer as correct or not
		this.correctAnswer = undefined;

		// for the hero and enemy animation
		// attack status of both player and enemy
		// status is false at the beginning of the game (meaning, no attack yet)
		this.playerAttack = false;
		this.enemyAttack = false;

		// for the score
		this.scoreLabel = 0;

		// for the timer
		this.timerLabel = undefined;
		this.countdownTimer = 60; // players can play the game within 60 seconds; can be modified per preference
		this.timedEvent = undefined;
	}

	preload() {
		// loading the image assets
		this.load.image("background", "images/bg_layer1.png");
		this.load.image("fight-bg", "images/fight-bg.png");
		this.load.image("tile", "images/tile.png");
		this.load.image("start-btn", "images/start_button.png");

		// loading the spritesheets
		this.load.spritesheet("player", "images/warrior1.png", {
			frameWidth: 80,
			frameHeight: 80,
		});
		this.load.spritesheet("enemy", "images/warrior2.png", {
			frameWidth: 80,
			frameHeight: 80,
		});
		this.load.spritesheet("numbers", "images/numbers.png", {
			frameWidth: 131,
			frameHeight: 71.25,
		});
		this.load.spritesheet("slash", "images/slash.png", {
			frameWidth: 42,
			frameHeight: 88,
		});

		// loading the start button image
		this.load.image("start-btn", "images/start_button.png");
	}

	create() {
		// =============== OBJECT CREATION ===============

		// creating the blue background
		this.add.image(240, 320, "background");
		// creating the fight, orange sky background
		const fight_bg = this.add.image(240, 160, "fight-bg");
		// creating the tile/ground
		const tile = this.physics.add.staticImage(
			240,
			fight_bg.height - 40,
			"tile"
		);

		// creating the player
		this.player = this.physics.add
			.sprite(
				this.gameHalfWidth - 150,
				this.gameHalfHeight - 200,
				"player"
			)
			.setOffset(-50, -8)
			.setBounce(0.2);

		// creating the enemy
		this.enemy = this.physics.add
			.sprite(
				this.gameHalfWidth + 150,
				this.gameHalfHeight - 200,
				"enemy"
			)
			.setOffset(50, -8)
			.setBounce(0.2)
			.setFlipX(true);

		// creating the slash effect
		this.slash = this.physics.add
			.sprite(240, 60, "slash")
			.setActive(false)
			.setVisible(false)
			.setGravityY(-500)
			.setOffset(0, -10)
			.setDepth(1)
			.setCollideWorldBounds(true);

		// calling the creation of the animations
		this.createAnimation();

		// creating the start button then calling the gameStart method when it's clicked
		let start_button = this.add
			.image(this.gameHalfWidth, this.gameHalfHeight + 181, "start-btn")
			.setInteractive();

		start_button.on(
			"pointerdown",
			() => {
				this.gameStart();
				start_button.destroy();
			},
			this
		);

		// creating the score in the game screen
		this.scoreLabel = this.createScoreLabel(26, 16, 0);

		// adding the timer in the game screen
		this.timerLabel = this.add
			.text(this.gameHalfWidth, 16, null)
			.setDepth(5);

		// =============== COLLISIONS AND OVERLAPS ===============

		// making the player collide with the ground
		this.physics.add.collider(this.player, tile);

		// making the enemy collide with the ground
		this.physics.add.collider(this.enemy, tile);

		// making the slash and player overlap
		this.physics.add.overlap(
			this.slash,
			this.player,
			this.spriteHit,
			null,
			this
		);

		// making the slash and enemy overlap
		this.physics.add.overlap(
			this.slash,
			this.enemy,
			this.spriteHit,
			null,
			this
		);
	}

    // main game loop
	update(time) {
		// if entered answer is correct, player attack animation would play
		// and slash would be created then fly towards the enemy to the right
		if (this.correctAnswer == true && !this.playerAttack) {
			this.player.anims.play("player-attack", true);
			this.time.delayedCall(500, () => {
				this.createSlash(
					this.player.x + 60,
					this.player.y,
					0,
					600,
					false
				);
			});
			this.playerAttack = true;
		}

		// if question is not answered, then both player and enemy are on standby
		if (this.correctAnswer == undefined) {
			this.player.anims.play("player-standby", true);
			this.enemy.anims.play("enemy-standby", true);
		}

		// if entered answer is wrong, enemy attack animation would play
		// and slash would be created then fly towards the player to the left
		if (this.correctAnswer == false && !this.enemyAttack) {
			this.enemy.anims.play("enemy-attack", true);
			this.time.delayedCall(500, () => {
				this.createSlash(
					this.enemy.x - 60,
					this.enemy.y,
					2,
					-600,
					true
				);
			});
			this.enemyAttack = true;
		}

		// if the game starts (that is, start button is clicked/pressed), start the timer
		if ((this.startGame == true)) {
			this.timerLabel
				.setStyle({
					fontSize: "24px",
					fill: "#000",
					fontStyle: "bold",
					align: "center",
				})
				.setText(this.countdownTimer);
		}
	}

    // method to create the player and enemy animations
	createAnimation() {
		// =========== PLAYER ANIMATION ===========

		// die animation
		this.anims.create({
			key: "player-die",
			frames: this.anims.generateFrameNumbers("player", {
				start: 0,
				end: 4,
			}),
			frameRate: 10,
		});

		// hit animation
		this.anims.create({
			key: "player-hit",
			frames: this.anims.generateFrameNumbers("player", {
				start: 5,
				end: 9,
			}),
			frameRate: 10,
		});

		// attack animation
		this.anims.create({
			key: "player-attack",
			frames: this.anims.generateFrameNumbers("player", {
				start: 10,
				end: 14,
			}),
			frameRate: 10,
		});

		// standby animation
		this.anims.create({
			key: "player-standby",
			frames: this.anims.generateFrameNumbers("player", {
				start: 15,
				end: 19,
			}),
			frameRate: 10,
			repeat: -1,
		});

		// =========== ENEMY ANIMATION ===========

		// die animation
		this.anims.create({
			key: "enemy-die",
			frames: this.anims.generateFrameNumbers("enemy", {
				start: 0,
				end: 4,
			}),
			frameRate: 10,
		});

		// hit animation
		this.anims.create({
			key: "enemy-hit",
			frames: this.anims.generateFrameNumbers("enemy", {
				start: 5,
				end: 9,
			}),
			frameRate: 10,
		});

		// attack animation
		this.anims.create({
			key: "enemy-attack",
			frames: this.anims.generateFrameNumbers("enemy", {
				start: 10,
				end: 14,
			}),
			frameRate: 10,
		});

		// standby animation
		this.anims.create({
			key: "enemy-standby",
			frames: this.anims.generateFrameNumbers("enemy", {
				start: 15,
				end: 19,
			}),
			frameRate: 10,
			repeat: -1,
		});
	}

    // method to execute once the game starts
    gameStart() {
        // changing game state to true and playing standby animations for both player and enemy
		this.startGame = true;
		this.player.anims.play("player-standby", true);
		this.enemy.anims.play("enemy-standby", true);

        // setting default result and question texts (these would be updated as the game progresses)
		this.resultText = this.add.text(this.gameHalfWidth, 200, "0", {
			fontSize: "32px",
			fill: "#000",
			fontFamily: "Arial, sans-serif",
		});
		this.questionText = this.add.text(this.gameHalfWidth, 100, "0", {
			fontSize: "32px",
			fill: "#000",
			fontFamily: "Arial, sans-serif",
		});

		// number buttons will be created when the game starts
		// (i.e., when the start button vanishes)
		this.createButtons();

		// when any of the number buttons is clicked/pressed, call the addNumber method
		this.input.on("gameobjectdown", this.addNumber, this);

		// calling the generateQuestion method when the game starts
		this.generateQuestion();

		// adding the timer to the game when it starts
        // gameOver method would always be called every second
		this.timedEvent = this.time.addEvent({
			delay: 1000,
			callback: this.gameOver,
			callbackScope: this,
			loop: true,
		});
	}

    // method to create the buttons
    createButtons() {
		// setting references
		const startPositionY = this.scale.height - 246;
		const widthDifference = 131;
		const heightDifference = 71.25;

		// ===============================================
		// creating the middle buttons first
		// middle buttons serve as reference for the left and right buttons

		// number 2
		this.button2 = this.add
			.image(this.gameHalfWidth, startPositionY, "numbers", 1)
			.setInteractive()
			.setData("value", 2);

		// number 5
		this.button5 = this.add
			.image(
				this.gameHalfWidth,
				this.button2.y + heightDifference,
				"numbers",
				4
			)
			.setInteractive()
			.setData("value", 5);

		// number 8
		this.button8 = this.add
			.image(
				this.gameHalfWidth,
				this.button5.y + heightDifference,
				"numbers",
				7
			)
			.setInteractive()
			.setData("value", 8);

		// number 0
		this.button0 = this.add
			.image(
				this.gameHalfWidth,
				this.button8.y + heightDifference,
				"numbers",
				10
			)
			.setInteractive()
			.setData("value", 0);
		// ===============================================

		// ===============================================
		// creating the left buttons
		// number 1
		this.button1 = this.add
			.image(
				this.button2.x - widthDifference,
				startPositionY,
				"numbers",
				0
			)
			.setInteractive()
			.setData("value", 1);

		// number 4
		this.button4 = this.add
			.image(
				this.button5.x - widthDifference,
				this.button1.y + heightDifference,
				"numbers",
				3
			)
			.setInteractive()
			.setData("value", 4);

		// number 7
		this.button7 = this.add
			.image(
				this.button8.x - widthDifference,
				this.button4.y + heightDifference,
				"numbers",
				6
			)
			.setInteractive()
			.setData("value", 7);

		// delete button
		this.buttonDel = this.add
			.image(
				this.button0.x - widthDifference,
				this.button7.y + heightDifference,
				"numbers",
				9
			)
			.setInteractive()
			.setData("value", "del");
		// ===============================================

		// ===============================================
		// creating the right buttons
		// number 3
		this.button3 = this.add
			.image(
				this.button2.x + widthDifference,
				startPositionY,
				"numbers",
				2
			)
			.setInteractive()
			.setData("value", 3);

		// number 6
		this.button6 = this.add
			.image(
				this.button5.x + widthDifference,
				this.button3.y + heightDifference,
				"numbers",
				5
			)
			.setInteractive()
			.setData("value", 6);

		// number 9
		this.button9 = this.add
			.image(
				this.button8.x + widthDifference,
				this.button6.y + heightDifference,
				"numbers",
				8
			)
			.setInteractive()
			.setData("value", 9);

		// ok/submit button
		this.buttonOk = this.add
			.image(
				this.button0.x + widthDifference,
				this.button9.y + heightDifference,
				"numbers",
				11
			)
			.setInteractive()
			.setData("value", "ok");
		// ===============================================
	}

    // method to store the player's input
	addNumber(pointer, object, event) {
		let value = object.getData("value");

        // checking first if the input is not a number
        if (isNaN(value)) {
			// if the 'del' button is pressed
			// delete the last element in the array of items
			if (value == "del") {
				this.numberArray.pop();

				// if length of numberArray is 0 (meaning, no player input), then the default value
				// of the 0th element is 0 (and this would be displayed in the game screen)
				if (this.numberArray.length < 1) {
					this.numberArray[0] = 0;
				}
			}

            // if the ok/submit button is pressed
			if (value == "ok") {
				this.checkAnswer(); // call the checkAnswer method
				this.numberArray = []; // resets the array to empty
				this.numberArray[0] = 0; // setting the default 0th element of numberArray to 0
            }
		} else {
			// conditions for button 0
			// if button 0 is pressed, the value of the 0th element is still 0 (which would be changed later)
			// meaning, we can't have a number beginning with 0
			if (this.numberArray.length == 1 && this.numberArray[0] == 0) {
				this.numberArray[0] = value;
			} else {
				// limiting the input number to 10 digits only
				// if the length of the array is less than 10
				if (this.numberArray.length < 10) {
					// add items to the array
					this.numberArray.push(value);
				}
			}
		}

		// joining/concatenating each digit in the numberArray as one whole number
        // converting the concatenated number string to integer 
		this.number = parseInt(this.numberArray.join(""));
		// setting the text of resultText to the concatenated number
		this.resultText.setText(this.number);

		// calculating the horizontal center of the resultText
		const textHalfWidth = this.resultText.width * 0.5;
		// setting the x-position of resultText
		this.resultText.setX(this.gameHalfWidth - textHalfWidth);

		// prevents further propagation of the current event in the capturing and bubbling phases
		event.stopPropagation();
	}

    // method to randomly get an operation
	getOperator() {
		// Note: ":" is replaced with "/" in the book because in PH, "/" means division
        // operation of the game is limited to addition, subtraction, multiplication, and division
        // can be extended according to preference
		const operator = ["+", "-", "x", "/"];
		// returning a random operator from the selection of operators
		return operator[Phaser.Math.Between(0, operator.length - 1)];
	}

    // method to randomly create a question according to the operation chosen
	generateQuestion() {
		// numberA stores first number
		// numberB stores second number
		// operator stores the operator chosen (+, -, x, /)
		// Note: Range of values can be decreased to make the game easier
		let numberA = Phaser.Math.Between(0, 50);
		let numberB = Phaser.Math.Between(0, 50);
		let operator = this.getOperator();

		// performing the addition operation
		// question[0] stores the text to be printed
		// question[1] stores the result of the calculation
		if (operator === "+") {
			this.question[0] = `${numberA} + ${numberB}`;
			this.question[1] = numberA + numberB;
		}

		// performing the subtraction operation
		if (operator === "-") {
			// if-else statements to prevent having a negative answer
			if (numberB > numberA) {
				this.question[0] = `${numberB} - ${numberA}`;
				this.question[1] = numberB - numberA;
			} else {
				this.question[0] = `${numberA} - ${numberB}`;
				this.question[1] = numberA - numberB;
			}
		}

		// performing the multiplication operation
        if (operator === "x") {
            // additional codes added to decrease range of numbers chosen when multiplication operation is picked
            // numberA and numberB is limited to 0-9 to prevent multiplying two digit numbers because it's difficult
            // these two lines of code can be commented/deleted if challenge is preferred
            let numberA = Phaser.Math.Between(0, 9);
			let numberB = Phaser.Math.Between(0, 9);

			this.question[0] = `${numberA} x ${numberB}`;
			this.question[1] = numberA * numberB;
		}

		// performing the division operation
		if (operator === "/") {
			// continuously reassigns a new numberA and numberB while numberA/numberB is not an integer
			do {
				numberA = Phaser.Math.Between(0, 50);
				numberB = Phaser.Math.Between(0, 50);
			} while (!Number.isInteger(numberA / numberB));

			this.question[0] = `${numberA} / ${numberB}`;
			this.question[1] = numberA / numberB;
		}

		// writing the generated question on the game screen
		this.questionText.setText(this.question[0]);
		const textHalfWidth = this.questionText.width * 0.5;
		this.questionText.setX(this.gameHalfWidth - textHalfWidth);
	}

    // method to check the if the player's input
	checkAnswer() {
		// this.number is entered by the player
		// this.question[1] is the calculated correct answer
		if (this.number == this.question[1]) {
			// setting the status of correctAnswer to true
			this.correctAnswer = true;
		} else {
			// setting the status of correctAnswer to false
			this.correctAnswer = false;
		}
	}

    // method to create the slash
	createSlash(x, y, frame, velocity, flip) {
		this.slash
			.setPosition(x, y)
			.setActive(true)
			.setVisible(true)
			.setFrame(frame)
			.setVelocityX(velocity)
			.setFlipX(flip);
	}

    // method to call if the slash and the player/enemy overlaps
	spriteHit(slash, sprite) {
		slash.x = 0;
		slash.y = 0;
		slash.setActive(false);
		slash.setVisible(false);

		if (sprite.texture.key == "player") {
			sprite.anims.play("player-hit", true);

			// if the player is hit, check first if score > 0
			// if score > 0, subtract 50 from the score
			// otherwise, don't subtract further to prevent having a negative score
			if (this.scoreLabel.getScore() > 0) {
				this.scoreLabel.add(-50);
			}
		} else {
			sprite.anims.play("enemy-hit", true);

			// if enemy is hit, add 50 to our score
			this.scoreLabel.add(50);
		}

        // wait for half a second to reset the state of the game and generate a new question
		this.time.delayedCall(500, () => {
			(this.playerAttack = false),
				(this.enemyAttack = false),
				(this.correctAnswer = undefined),
				this.generateQuestion();
		});
	}

    // method to create the score label
	createScoreLabel(x, y, score) {
		const style = {
			fontSize: "24px",
			fill: "#000",
			fontStyle: "bold",
		};

		const label = new ScoreLabel(this, x, y, score, style).setDepth(1);
		this.add.existing(label);
		return label;
	}

    // method to be called every second
	gameOver() {
		// time decreases by 1 second
		this.countdownTimer -= 1;

		// if time is up, automatically switch to the game over scene
		if (this.countdownTimer < 0) {
			this.scene.start("game-over-scene", {
				score: this.scoreLabel.getScore(),
			});
		}
	}
}