/* eslint-disable no-undef */
/* eslint-disable brace-style */
// Sans Boss fight from Undertale
// Hanson
// Date
//
// Extra for Experts:
// very simmilar to the original game
// it will always fit the screen's size
// multiple script
// inheritance
// promise
// very complex math look at line 1236-1252, or 969-1221



// note to my self
// change the INPUT order of constructor
// see IMPORTANT!!!
// main attack detect teleport attack
// test if return works in attack skip


let player = new Player();

// what state are you on
let state = "starting screen";

// the level is seperated by action
let level = 0;

// scale of Player
let scaleOfPlayer;

// global time
// let currentMillis;
// initial attack time
let attackInitialTime = 0;
// last time damage is taken
let damageLastTime = 0;

// start music
let startMusic = true;

let platformEdgeOrder = new Map();
platformEdgeOrder.set("up", 0);
platformEdgeOrder.set("left", 1);
platformEdgeOrder.set("down", 2);
platformEdgeOrder.set("right", 3);

let modes = [];
let mode = 0;
let actions = [];
let action = 0;

let currentBones;
let currentBonesIndex;
let currentGravity;
let currentGravityIndex;
let currentPlatformEdge;

let heart;
let heartDown;
let heartUp;
let heartLeft;
let heartRight;
let megalovania;
let canLoad = true;
let finishLoad;

 
// setup
function setup() {
  // set up COMPLETED
  // create canvas
  createCanvas(windowWidth, windowHeight);
  // initialize varibles for player
  scaleOfPlayer = 0.000045 * width;
  player.dx = player.dx * height;
  player.dy = player.dy * height;
  // initialize varibles for text
  actions = [
    {word: "fight", positionX: 0.1 * height, positionY: 0.835 * height},
    {word: "act", positionX: 0.35 * height, positionY: 0.835 * height},
    {word: "item", positionX: 0.6 * height, positionY: 0.835 * height},
    {word: "spare", positionX: 0.85 * height, positionY: 0.835 * height}
  ];
  modes = [
    {word: "normal", position: 0},
    {word: "practice", position: 1},
    {word: "single attack", position: 2},
    {word: "endless", position: 3},
  ];
  // // music can start now
  // megalovania.jump(0);
  // megalovania.play();
  // megalovania.setLoop(true);
  // startMusic = true;
  let inputGameMode = prompt("if you want to hack type: God\nif you want know rules type: help\nelse type name(HansonDestroy is the superior name)", "HansonDestroy")

  if (inputGameMode === "help"){
    player.health = 184;
    prompt("okay so this is how this game work\n You press space to enter a mode like the normal mode or take an action like the fight action \n You press wsad lower-cased to mover around.\n When there are gravity and if you are falling down lets say pressing w key will not make you move up but the a and s key still works.\n The white bone will hurt you if you touch it and the blue bone will not hurt you as long as you are not moving when touching it (basic undertale knowledge)\n I played though all the level without taking damage so if you kept dying then you are just bad.\n Search up bad time simmulator on google if you want to get better or see the original game");
    prompt("Every level start off with a stab attack so donot jump immidiately because the gravity will pull you down you want to time the jump about 0.5 slower.\n the levels get harder and harder for level one it is simple you just move away from the direction of gravity\n level 1 is just move away fromt he green area when they turn white you die\n level 2 is just staying consistant and you will find the right rythem to jump through everything do not move away from the middele just jump\n level 3 is tricky the way I do this in the original game is I click w key and d key at the same time and release the w key the moment you rise above the white bone then figure out when to release the d key. you can't do it immidiately because you will get hit by the bluebone but not too late because you have no room\n The way to beat level 4 is the spam click all the keys in a circlular motion so click w a s d in ths order. It looks like there is more sophistated stratagy but it is much harder than it seems.(The stratagy that brayden uses is to span w and s but my method is safer)\n level 5: level 5 is very hard and there is no good stratagy other than get good. The timing is really hard I see you taking a lot of damage here. Level 6 you can cheese the original game by pressing every key at the same time the entire time. I purposefully did not patched this bug even though I could but if you don't want to cheese it then I guess have a good reation rate nothing you can do here really. Level 8 is level 2 but much faster. Same strat\n Level 9: There is a patter that whenever a tall one will come it will take more time to come so you can pretty much predict everything with enough practice. Again this game is hard go god mode if you want")
  }
  else if(inputGameMode === "God"){
    player.health = 92000;
  }
  else if(inputGameMode === "HansonDestroy"){
    player.health = 92*2;
  }
  else{
    player.health = 92;
  }

  finishLoad = preloadWithPromise();
}

// draw
function draw() {
  // draw TEMP
  background(100);
  if (state === "starting screen"){
    drawStartScreen();
  }
  else if (state === "action time"){
    displayPlatformEdge();
    displayActions();
    // make the heart go to the right place 
    player.x = actions[action].positionX;
    player.y = actions[action].positionY;
    // display the heart
    player.displayImage("heart");
  }
  else if (state !== "death"){

    image(sans, height/2, height/3, height/6.5, height/5);
    
    // main attack funciton TEMP
    while (mainAttack() === "try again"){
      // blank space
    }

    displayPlatformEdge();
    displayActions();

    // health bar and health COMPLETED
    text(player.health,50,50);
    rect(300,50,player.health*2,30);
    if (player.health < 0){
      state = "death";
    }
  }
  else{
    // death screen
    background(0);
    fill("white");
    text("die",50,50);
  }
}
