# Math Fighter

<p align='center'>
  <img src='https://github.com/ajgquional/Timedoor_MathFighter/blob/4a959ed66cae94a8c59d2c9e04d14e968bf7bb6a/MathFighterSampleOutput1.png' alt='Sample Math Fighter game' width='500' height='700'>
</p>

<p align='center'>
  <img src='https://github.com/ajgquional/Timedoor_MathFighter/blob/4a959ed66cae94a8c59d2c9e04d14e968bf7bb6a/MathFighterSampleOutput2.png' alt='Sample Math Fighter game over scene' width='500' height='700'>
</p>

## Description of the game
This is the fifth Phaser game of Intermediate 2 of the Intermediate JavaScript class of Timedoor Coding Academy. Unlike the other games previously created in the course where a player is being controlled, the Math Fighter game is a test of wit. In this game, players have to answer a series of math questions until the time runs out. There are number buttons on the game screen which players can use to answer the randomly-generated questions. If the player's answer is correct, 50 points would be earned and the hero character would attack the enemy character. However, if the player's answer is incorrect, 50 points would be deducted from the score and the hero character would suffer an attack from the enemy character. Once time runs out, it's game over; however, players can still replay the game by pressing the play button on the game over screen.

The codes for this game are mostly copied from Timedoor's Intermediate JavaScript course book, but modified due to personal preference and due to existence of errors in the original source code. The codes here (especially the scenes code) are highly annotated and documented for clarity.

## About the repository
This repository only contains the source codes as well as assets linked in the exam instructions (as a Google Drive link). Thus, this repository is mainly for reference. Should you wish to use these files, you may download them and copy them to the template folder but make sure first that a Phaser framework is installed in your local machine and necessary steps have been conducted (such as installation of node.js and Visual Studio Code). Afterwards, the public (which contains the assets) and src (which contains all the source codes) folders can be copied in the game folder. The "game" can be run by typing the command ```npm run start``` in the terminal within Visual Studio Code, then clicking on the local server link (for instance, localhost:8000) in the terminal. The game will then open in your default browser.

### Notes on the content of the repository:
* public - contains a single sub-folder containing the image assets
* src - contains the source codes mainly contained in two sub-folders, as well as ```index.html``` and ```main.js```
  * scenes - contains the main game scene (```MathFighterScene.js```) as well as the game over scene (```GameOverScene.js```)
  * ui - contains the score label class (```ScoreLabel.js```) to create the score text in the main game scene as well as game over scene
    
## Summarized game mechanics and link to sample game
- Platforms:
  - Mobile
  - PC/Web browser
- Mechanics: 
  - Players have to input their answer to the math question by pressing the number buttons
  - Answer can be submitted by pressing the OK button
  - Number digit can be deleted by pressing the DEL button 
- Rules:
  - Earn as many points as you can before the time (60 seconds) runs out.
  - If answer is correct, 50 points would be added to the score and the hero character would attack the enemy character.
  - If answer is incorrect, 50 points would be deducted to the score (note that the game doesn't allow a negative score) and the hero character would attain a damage inflicted by the enemy character.
  - Once the time runs our, the game is over.
- Link to the sample game: https://td-mathfighter-adrian.netlify.app/
  
