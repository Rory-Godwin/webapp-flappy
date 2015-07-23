// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;
var score_label;
var player;
var step_size = 100;
var pipes = [];
var cx;
var cy;

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("spam_image","../assets/home-cat.jpg");
    game.load.image("background_image","../assets/urban.jpg");
    game.load.image("flap","../assets/flappy_superman.png");
    game.load.audio("audio1","../assets/point.ogg");
    game.load.image("pipe","../assets/pipe.png");


}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
// set the background colour of the scene
    var background = game.add.image(0,0,"background_image");
    background.width = 790
    background.height = 400
    game.physics.startSystem(Phaser.Physics.ARCADE);
// Score Label
    score_label = game.add.text(350,50,"0",{font:"100px Arial",fill:"#FF9900"});
// Pipe generation
    generate_pipe();
    player = game.add.sprite(250,200,"flap");
    game.physics.arcade.enable(player);
    player.body.velocity.x = 0;
    player.body.gravity.y = 750;
    pipeInterval = 1.75;
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generate_pipe);

// Interactions
// Cat spam (optional)
    //game.input.onDown.add(spam);
    //game.input.onDown.add(clicking);
// Modified flap kill
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(jump);
    game.input.keyboard.addKey(Phaser.Keyboard.K).onDown.add(flapkill);
    game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(respawn);
    //game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(space);
// Score Message (not needed0
    //alert(score)
    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(move_right);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(move_left);
    game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(move_up);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(move_down);

}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    //game.physics.arcade.overlap(player, pipes, gameOver);
    for(var index=0; index<pipes.length; index++){
        game.physics.arcade.overlap(player, pipes[index], gameOver);
    }
}
//function spam(event) {
//alert("Cat attack! Target at position: " + event.x + "," + event.y);
//for(m =0; m < 79; m++) {
//for(var repeat = 0; repeat < 8; repeat++) {
//var p1 = game.add.sprite(80*m,0+50*i,"spam_image");
//p1.width = 75
//p1.height = 50
//}
//}

//}
//function clicking(event) {
//game.add.sprite(event.x, event.y, "flap")
//}
function jump(){
    player.body.velocity.y = -275;
}
function flapkill() {
    cx = player.x;
    cy = player.y;
    player.kill();
}
function respawn(){
    game.add.sprite(cx,cy,"flap");
}

function trackscore() {
    score ++;
    score_label.setText(score.toString());
}

// Movement
function move_right(){
    player.x = player.x +step_size;
}
function move_left(){
    player.x = player.x -step_size;
}
function move_up(){
    player.y = player.y -step_size;
}
function move_down(){
    player.y = player.y +step_size;
}
// To generate random pipes across screen
//function generate_pipe() {
//for(i = 0; i < 7; i ++){
//var gap = game.rnd.integerInRange(1, 4);
//for(var count = 0; count < 8; count ++){
//if(count != gap && count != gap +1){
//game.add.sprite(150 +130*i, 50*count, "pipe");
//}
//}
//}
//}
// To generate single, random pipe

//Pipe generation
function addPipeBlock(x, y) {
    // create a new pipe block
    var block = game.add.sprite(x,y,"pipe");
    // insert it in the 'pipes' array
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = -200

}
function generate_pipe() {
    // calculate a random position for the gap
    var extra = game.rnd.integerInRange(0, 1);
    if (extra == 0){
        // generate the pipes, except where the gap should be
        var gap = game.rnd.integerInRange(1 ,5);
        // gap length 2
        for (var count = 0; count < 8; count ++) {
            if (count != gap && count != gap +1) {
                addPipeBlock(750, count*50);
            }
        }
    }
    else {
        // generate the pipes, except where the gap should be
        var gap1 = game.rnd.integerInRange(1, 4);
        // gap length 3
        for (var count1 = 0; count1 < 8; count1++) {
            if (count1 != gap1 && count1 != gap1 + 1 && count1 != gap1 + 2) {
                addPipeBlock(750, count1 * 50);
            }
        }
    }
    trackscore();
}
function gameOver(){
    location.reload();
}

