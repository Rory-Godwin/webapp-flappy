// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'game', stateActions);

var score = -2;
var labelScore;
var player;
var step_size = 5;
var pipes = [];
var gravs = [];
var v = -200;
var stars = [];
var width = 1000;
var height = 500;
var pipeGap = 100;


$.get("/score", function(scores){
    scores.sort(function (scoreA, scoreB){
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < scores.length; i++) {
        $("#scoreBoard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }

    console.log("hellow world");
});
/*
 * Loads all resources for the game and gives them names.
 */


function preload() {
    game.load.image("playerImg1", "../assets/dragon1.png");
    game.load.image("backgroundImg", "../assets/apocalypse2.png");
    game.load.image("Img1", "../assets/star1.png");
    game.load.image("Img2", "../assets/fireball1.jpg");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe", "../assets/spikes1.png");


}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    var background = game.add.image(0, 0, "backgroundImg");
    background.width = 1000;
    background.height = 750;
    //game.add.text(140, 170,  "WELCOME TO HELL", {font: "50px arial black", fill: "#FFFFFF"});
    labelScore = game.add.text(20, 20, "0", {font: "40px arial black", fill: "#ffffff"});
    player = game.add.sprite(100, 200, "playerImg1");
    generatePipe();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    player.body.velocity.y = 50 ;
    player.body.gravity.y = 300;
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    pipeInterval = 3.00;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);

    power1 = 4;
    game.time.events
        .loop(power1 * Phaser.Timer.SECOND, addPower1);
}

function changeScore() {
    score = score + 0.5;
    labelScore.setText(score.toString());
}

function addPower1() {
    var power1sprite = game.add.sprite(1000, game.rnd.integerInRange(0, 450), "Img2");
    gravs.push(power1sprite);
    game.physics.arcade.enable(power1sprite);
    power1sprite.body.velocity.x = game.rnd.integerInRange(-50, -700);
}


function move_up(){
    player.y = player.y -step_size
}

function move_down(){
    player.y = player.y +step_size
}
function generatePipe1() {
    var gap = game.rnd.integerInRange(2 ,8 );
    for (var count=0; count<10; count++) {
        if (count != gap && count != gap+1) {
            addPipeBlock(970, count*50);
        }
    }
    addStar(width-25, 250);
}


function generatePipe() {
    var gapStart = game.rnd.integerInRange(50, height - 50 - pipeGap);

    //addPipeEnd(width-5,gapStart - 25);
    for(var y=gapStart - 75; y>-50; y -= 50){
        addPipeBlock(width,y);
    }
   // addPipeEnd(width-5,gapStart+pipeGap);
    for(var y=gapStart + pipeGap + 25; y<height; y += 50){
        addPipeBlock(width,y);
    }
    addStar(width, gapStart + pipeGap/2 - 25);
}


function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = v;
}

function playerJump() {
    player.body.velocity.y = -150;
}


/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {

    game.physics.arcade
        .overlap(player,
        pipes,
        gameOver);
    for (var i = 0; i < gravs.length; i++) {

        game.physics.arcade
            .overlap(player,
            gravs[i],
            function () {
                powerUp();
                gravs[i].kill();

            })
    }

    game.physics.arcade
        .overlap(player,
        pipes,
        gameOver); game.physics.arcade
        .overlap(player,
        gravs,
        powerUp);
    if(player.body.y < 0){
        gameOver();
    }
    if(player.body.y  > 500){
        gameOver();
    }
    player.rotation = Math.atan(player.body.velocity.y / 550);


    game.physics.arcade
        .overlap(player,stars, changeScore);

    for(var i=stars.length; i>=0; i--){
        game.physics.arcade.overlap(player,stars[i], function(){
            stars[i].destroy();
            stars.splice(i,1);
            changeScore();
        });
    }
}


function addStar(x, y) {
    var bonus = game.add.sprite(x, y, "Img1");
    stars.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
}

function gameOver() {
    game.destroy();
    game.add.text(140, 170, "game over", {font: "200 px arial black", fill: "#FFFFFF"});
    $("#score").val(score);
    $("#greeting").show();
    stars = [];
}

function powerUp(){
    score = score + 1;

}

