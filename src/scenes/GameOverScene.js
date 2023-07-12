import Phaser from 'phaser'

export default class GameOverScene extends Phaser.Scene
{
    constructor()
    {
        super('game-over-scene');
    }

    init(data)
    {
        this.score = data.score;

        this.gameHalfWidth = this.scale.width * 0.5;
        this.gameHalfHeight = this.scale.height * 0.5;
    }

    preload()
    {
        // loading the images needed for the game over screen
        this.load.image('background', 'images/bg_layer1.png'); 
        this.load.image('gameover', 'images/gameover.png');
        this.load.image('replay', 'images/replay.png');  
    }

    create()
    {
        // creating the background
        this.add.image(200, 320, 'background');

        // creating the game over text
        this.add.image(this.gameHalfWidth, this.gameHalfHeight - 150, 'gameover');

        // creating the replay button
        this.replayButton = this.add.image(this.gameHalfWidth,  this.gameHalfHeight + 150, 'replay').setInteractive();
        
        // if replay button is pressed, automatically switch to the main game screen
        this.replayButton.once('pointerdown', () => { 
            this.scene.start('math-fighter-scene') }, this);
            
        // displaying the score in the game over screen
        // "SCORE: " text
        this.add.text(this.gameHalfWidth - 150, this.gameHalfHeight, 'SCORE:', { 
            fontSize: '60px', 
            fill: '#fc03ec',
            fontStyle: 'bold' 
        });

        // actual score value
        this.add.text(this.gameHalfWidth + 90, this.gameHalfHeight, this.score, { 
            fontSize: '60px', 
            fill: '#fc03ec',
            fontStyle: 'bold' 
        });
    }
}