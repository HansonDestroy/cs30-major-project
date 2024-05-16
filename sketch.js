/* eslint-disable brace-style */
// Sans Boss fight from Undertale
// Hanson
// Date
//
// Extra for Experts:
// search bad time simulator on google and play the game so you know what I'm I trying to clone here
// I added music that would play when mouse is clicked
// I technically have 2d arrays because in the currentBones array there is a list of attacks and in each attack there is a list of gravities
// it will always fit the screen's size



// note to my self
// optimization
// reation time not starting form the attack period but only when it hit the ground for bone tab
// display box only when it hit the ground for bone tab
class TabAttack{
  constructor(reaction,changeTime,endTime,damage,cooldown,direction,heightOfZone,zone,gravity, boneTime){
    // innit varible COMPLETED
    this.type = "tab";
    this.reaction = reaction;
    this.changeTime = changeTime;
    this.endTime = endTime;
    this.damage = damage;
    this.cooldown = cooldown;
    this.direction = direction;
    this.height = heightOfZone;
    this.currentHeight = 0;
    this.zone = zone;
    this.gravity = gravity;
    this.boneTime = boneTime;
  }


  // calculate zone function
  calculateDamageZone(platformEdge){
    // draw the right damge zone at the right place. very hard I wish not to look back at it. COMPLETED
    if (this.direction === "up"){
      this.zone = [
        platformEdge[platformEdgeOrder.get("up")].x,
        platformEdge[platformEdgeOrder.get("up")].y
        + platformEdge[platformEdgeOrder.get("down")].w / 2
        + this.height / 2,
        platformEdge[platformEdgeOrder.get("up")].l
        - platformEdge[platformEdgeOrder.get("left")].l
        - platformEdge[platformEdgeOrder.get("right")].l,
        this.height
      ];
    }
    if (this.direction === "down"){
      this.zone = [
        platformEdge[platformEdgeOrder.get("down")].x,
        platformEdge[platformEdgeOrder.get("down")].y
        - platformEdge[platformEdgeOrder.get("down")].w / 2
        - this.height / 2,
        platformEdge[platformEdgeOrder.get("down")].l
        - platformEdge[platformEdgeOrder.get("left")].l
        - platformEdge[platformEdgeOrder.get("right")].l,
        this.height
      ];
    }
    if (this.direction === "left"){
      this.zone = [
        platformEdge[platformEdgeOrder.get("left")].x
        + platformEdge[platformEdgeOrder.get("left")].l / 2
        + this.height / 2,
        platformEdge[platformEdgeOrder.get("left")].y,
        this.height,
        platformEdge[platformEdgeOrder.get("left")].w
        - platformEdge[platformEdgeOrder.get("up")].w
        - platformEdge[platformEdgeOrder.get("down")].w
      ];
    }
    if (this.direction === "right"){
      this.zone = [
        platformEdge[platformEdgeOrder.get("right")].x
        - platformEdge[platformEdgeOrder.get("right")].l / 2
        - this.height / 2,
        platformEdge[platformEdgeOrder.get("right")].y,
        this.height,
        platformEdge[platformEdgeOrder.get("right")].w
        - platformEdge[platformEdgeOrder.get("up")].w
        - platformEdge[platformEdgeOrder.get("down")].w
      ];
    }
  }

  calculateCurrentDamageZone(platformEdge){
    // draw the right damge zone at the right place. very hard I wish not to look back at it. COMPLETED
    if (this.direction === "up"){
      this.zone = [
        platformEdge[platformEdgeOrder.get("up")].x,
        platformEdge[platformEdgeOrder.get("up")].y
        + platformEdge[platformEdgeOrder.get("down")].w / 2
        + this.currentHeight / 2,
        platformEdge[platformEdgeOrder.get("up")].l
        - platformEdge[platformEdgeOrder.get("left")].l
        - platformEdge[platformEdgeOrder.get("right")].l,
        this.currentHeight
      ];
    }
    if (this.direction === "down"){
      this.zone = [
        platformEdge[platformEdgeOrder.get("down")].x,
        platformEdge[platformEdgeOrder.get("down")].y
        - platformEdge[platformEdgeOrder.get("down")].w / 2
        - this.currentHeight / 2,
        platformEdge[platformEdgeOrder.get("down")].l
        - platformEdge[platformEdgeOrder.get("left")].l
        - platformEdge[platformEdgeOrder.get("right")].l,
        this.currentHeight
      ];
    }
    if (this.direction === "left"){
      this.zone = [
        platformEdge[platformEdgeOrder.get("left")].x
        + platformEdge[platformEdgeOrder.get("left")].l / 2
        + this.currentHeight / 2,
        platformEdge[platformEdgeOrder.get("left")].y,
        this.currentHeight,
        platformEdge[platformEdgeOrder.get("left")].w
        - platformEdge[platformEdgeOrder.get("up")].w
        - platformEdge[platformEdgeOrder.get("down")].w
      ];
    }
    if (this.direction === "right"){
      this.zone = [
        platformEdge[platformEdgeOrder.get("right")].x
        - platformEdge[platformEdgeOrder.get("right")].l / 2
        - this.currentHeight / 2,
        platformEdge[platformEdgeOrder.get("right")].y,
        this.currentHeight,
        platformEdge[platformEdgeOrder.get("right")].w
        - platformEdge[platformEdgeOrder.get("up")].w
        - platformEdge[platformEdgeOrder.get("down")].w
      ];
    }
  }

  // damage function
  takeDamage(currentMillis){
    if (
      player.x < this.zone[0] + this.zone[2] / 2 &&
      player.x > this.zone[0] - this.zone[2] / 2 &&
      player.y < this.zone[1] + this.zone[3] / 2 &&
      player.y > this.zone[1] - this.zone[3] / 2 &&
      damageLastTime + this.cooldown < currentMillis) {
      player.health -= this.damage;
      damageLastTime = currentMillis;
    }
  }
    
}

class Player{
  constructor(){
    this.x = 0;
    this.y = 0;
    this.dx = 0.005;
    this.dy = 0.005;
    this.health = 9299;
  }

  displayImage(imageName){
    if (imageName === "heart"){
      image(heart, this.x, this.y, heart.width * scaleOfPlayer, heart.height * scaleOfPlayer);
    }
    if (imageName === "down"){
      image(heartDown, this.x, this.y, heartDown.width * scaleOfPlayer, heartDown.height * scaleOfPlayer);
    }
    if (imageName === "up"){
      image(heartUp, this.x, this.y, heartUp.width * scaleOfPlayer, heartUp.height * scaleOfPlayer);
    }
    if (imageName === "right"){
      image(heartRight, this.x, this.y, heartRight.width * scaleOfPlayer, heartRight.height * scaleOfPlayer);
    }
    if (imageName === "left"){
      image(heartLeft, this.x, this.y, heartLeft.width * scaleOfPlayer, heartLeft.height * scaleOfPlayer);
    }
  }
}

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
let currentAttackIndex;
let currentPlatformEdge;
let currentGravity;
let currentGravityIndex;

let heart;
let heartDown;
let heartUp;
let heartLeft;
let heartRight;
let megalovania;


let canLoad = true;
let finishLoad;
function preloadWithPromise() {
  let promise = new Promise(
    function (resolve, reject) {
      if (canLoad){
        megalovania = loadSound("assets/audio/Megalovania.mp3");
        resolve();
      }
      else{
        reject();
      }
    });
  return promise;
}


// load everthing COMPLETE
// could use promise to preload OPTIONAL
function preload() {
  // preload COMPLETED
  heart = loadImage("assets/image/heart.png");
  heartDown = loadImage("assets/image/heartDown.png");
  heartUp = loadImage("assets/image/heartUp.png");
  heartLeft = loadImage("assets/image/heartLeft.png");
  heartRight = loadImage("assets/image/heartRight.png");
  // preloadWithPromise()
  // megalovania = loadSound("assets/audio/Megalovania.mp3");
} 

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
    
    // main attack funciton TEMP
    mainAttack();
  }
  else{
    // death screen
    background(0);
    fill("white");
    text("die",50,50);
  }
}

// when state is draw start screen
function drawStartScreen(){
  // draw the start screen COMPLETED
  // innitailize
  const TITLE_HIEGHT = 0.25;
  const TITLE_WIDTH = 0.6;
  const MODE_WIDTH = 0.1;
  const MODE_HEIGHT = 0.45;
  const MODE_HEIGHT_DIFFERENCE = 0.1;
  // display the title being: Sans Boss Fight from Undertale
  // formating
  fill("white");
  textAlign(CENTER,CENTER);
  textSize(1);
  for(let i = 0; textWidth("Sans Boss Fight from Undertale") < TITLE_WIDTH * width; i++){
    textSize(i);
  }
  // display text
  text("Sans Boss Fight from Undertale", width / 2, TITLE_HIEGHT * height);

  // display all the modes being: normal, endless....
  // formating
  fill("white");
  textAlign(LEFT,CENTER);
  textSize(1);
  for(let i = 1; textWidth("Normal") < MODE_WIDTH * width; i++){
    textSize(i);
  }
  
  // display text of modes
  for(let modeText of modes){
    text(modeText.word, width/2, (MODE_HEIGHT + MODE_HEIGHT_DIFFERENCE * modeText.position) * height);
  }

  // display heart at the right mode
  const HEART_X = 0.45;
  imageMode(CENTER);
  player.x = HEART_X * width;
  player.y = (MODE_HEIGHT + MODE_HEIGHT_DIFFERENCE * modes[mode].position) * height;
  player.displayImage("heart");

}

// change action or mode or tying
function keyTyped(){
  // chage mode or action COMPLETED
  // if key typed at the starting screen
  if (state === "starting screen"){
    if (key === "s"){
      mode++;
    }
    else if (key === "w"){
      mode--;
    }
    else if (key === " "){
      state = modes[mode].word;
      level++;
      innit();
      scaleOfPlayer = 0.000045 * height;
    }
    mode += modes.length;
    mode = mode % modes.length;
  }

  // if key typed at the action time
  if (state === "action time"){
    if (key === "d"){
      action++;
    }
    if (key === "a"){
      action--;
    }
    if (key === " "){
      level++;
      innit();
      state = modes[mode].word;
    }
    action += modes.length;
    action = action % actions.length;
  }
  
}


function mainAttack(){
  //initailize COMPLETED
  let currentMillis = millis();
  let attack = currentBones[currentAttackIndex];
  let gravity = currentGravity[currentGravityIndex];
  // Change gravity to the right mode depending on the timming of attack.changeTime
  if (attack.type === "tab"){
    if (currentMillis - attackInitialTime > attack.changeTime){
      currentGravityIndex = 2;
      gravity = currentGravity[currentGravityIndex];
    } 
  }

  // When the attack ends COMPLETED
  if (currentMillis - attackInitialTime > attack.endTime){
    // if the time in the attack excessed the end time then end it by moving to the next attack    

    // increase attack index and
    // reset everything else
    attackInitialTime = currentMillis;

    currentAttackIndex++;
    attack = currentBones[currentAttackIndex];

    // when the level ends COMPLETED
    // check if the attack type is next round then it is the last atack thus advance level COMPLETED
    if (attack.type === "next round"){
      state = "action time";
      return 0;
    }

    // reset gravity
    currentGravityIndex = 0;
    currentGravity = attack.gravity;
    gravity = currentGravity[currentGravityIndex];
  }

  // move player TEMP
  movePlayer(gravity);
  moveBones(attack, currentMillis);

  // display bones, player, action boxes, platform edgeCOMPLETED
  displayBones(attack, currentMillis);
  displayPlatformEdge();
  displayActions();
  displayPlayer(attack, gravity);
  
  
  // health bar and health COMPLETED
  text(player.health,50,50);
  rect(300,50,player.health*2,30);
  if (player.health < 0){
    state = "death";
  }

  // a way to track the player DEBUG
  // line(player.x, 0, player.x, height);
  // line(0, player.y, width, player.y);
  // circle(player.x, player.y, heart.width * scaleOfPlayer)
}

function moveBones(attack, currentMillis){
  // move the bone
  if (attack.type === "tab"){
    // the attack is tab
    // draw the zone and determine if damage need to be taken
    if (currentMillis - attackInitialTime > attack.reaction){
      // if the reaction period is over then have the bone come up
      // set the height to the right height and calculate zone
      if (attack.currentHeight < attack.height){
        // map the height into the ratio of the time between 
        // after the reaciton period and the boneTime
        // to the original height
        // eslint-disable-next-line no-extra-parens
        attack.currentHeight = map((currentMillis - attackInitialTime - attack.reaction),
          0 , attack.boneTime - attack.reaction,
          0, attack.height);
        attack.calculateCurrentDamageZone(currentPlatformEdge);
      }
    }
  }
}

// display functions
function displayBones(attack, currentMillis){
  // damage is built in this function other than displaying bones
  if (attack.type === "tab"){
    // the attack is tab
    // draw the zone and determine if damage need to be taken
    if (currentMillis - attackInitialTime < attack.reaction){
      // if the time elapsed in this level(currentMillis - time) is within(<) the reaction time(attack.reaction)
      // then color the zone green as warning

      // note if it is dropping to the ground at gravity1 or gravityIndex == 0 then do not display the box at all TEMP
      if (currentGravityIndex !== 0){
        // condition met draw green zone
        rectMode(CENTER);
        fill(0,150,0);
        rect(attack.zone[0],attack.zone[1],attack.zone[2],attack.zone[3]);
      }

      // animation of sans throwing his hands down OPTIONAL
      // code here

    } else{
      // your reation time have passed
      // therefore your grace period is over and the zone is filled with white now
      rectMode(CENTER);
      fill(150,150,150);
      rect(attack.zone[0],attack.zone[1],attack.zone[2],attack.zone[3]);
      
      // take damage
      attack.takeDamage(currentMillis);

      // bone picture: draw image of bone comming up
      // bone picture = current height
    }
  }
  if (attack.type === "gap"){
    if (state !== "dsfkad;lfksal;dkasdfk;slakdf;lak"){
      rectMode(CENTER);
      fill(150,150,150);
      rect(attack.zone[0][0],attack.zone[0][1],attack.zone[0][2],attack.zone[0][3]);
      rect(attack.zone[1][0],attack.zone[1][1],attack.zone[1][2],attack.zone[1][3]);
      rect(attack.zone[2][0],attack.zone[2][1],attack.zone[2][2],attack.zone[2][3]);
      rect(attack.zone[3][0],attack.zone[3][1],attack.zone[3][2],attack.zone[3][3]);
    }
    else{
      rectMode(CENTER);
      fill(150,150,150);
      rect(attack.zone[0],attack.zone[1],attack.zone[2],attack.zone[3]);
      if (
        player.x < attack.zone[0] + attack.zone[2] / 2 &&
        player.x > attack.zone[0] - attack.zone[2] / 2 &&
        player.y < attack.zone[1] + attack.zone[3] / 2 &&
        player.y > attack.zone[1] - attack.zone[3] / 2 &&
        damageLastTime + attack.cooldown < currentMillis) {
        player.health -= attack.damage;
        damageLastTime = millis();
      }
    }

  }
} function displayPlatformEdge(){
  // given the currentPlatformEdge display each of them COMPLETED
  for (let platformEdge of currentPlatformEdge){
    rectMode(CENTER);
    fill("white");
    noStroke();
    rect(platformEdge.x, platformEdge.y, platformEdge.l, platformEdge.w);
  }
} function displayActions(){
  // display all the text of actions COMPLETED
  textAlign(LEFT);
  for (let actionText of actions){
    text(actionText.word,actionText.positionX,actionText.positionY);
  }
} function displayPlayer(attack, gravity){
  // COMPLETED
  // display red heart if no gravity
  if (gravity.mode === "off"){
    player.displayImage("heart");
  }
  // display the blue heart at the right direction
  else{
    player.displayImage(attack.direction);
  }

} 

function movePlayer(gravity) {
  // TEMP
  if(gravity.mode === "off"){
    stopAtDown();
    stopAtUp();
    stopAtLeft();
    stopAtRight();
  } else{
    if (gravity.accerlerationY < 0) {
      //gravity is accelerating upwards
      //initialize move and the up platform
      let move = true;
      let platformEdge = currentPlatformEdge[platformEdgeOrder.get("up")];
      // if player is below the platform
      // and if the [right side of the platform] covers (aka > than)  [left side of the player]
      // and if the [left side of the platform] covers (aka < than)  [right side of the player]
      // and if the [top of the player] + gravity.dy is above (aka < than) [the bottom of the edge]
      // then you will go throught the wall. Thus hit the ground
      if (
        player.y > platformEdge.y &&
        platformEdge.x + platformEdge.l / 2 > player.x - heart.width * scaleOfPlayer / 2 &&
        platformEdge.x - platformEdge.l / 2 < player.x + heart.width * scaleOfPlayer / 2 &&
        player.y - heart.height * scaleOfPlayer / 2 + gravity.dy < platformEdge.y + platformEdge.w / 2
      ) {
        // move = false so you stop moving throught the wall
        move = false;
        // gravity index change mode since you hit the ground
        if (currentGravityIndex === 0){
          currentGravityIndex = 1;
          attackInitialTime = millis();
        }
        // place the player at the below of the top edge
        player.y = platformEdge.y + platformEdge.w / 2 + heart.height * scaleOfPlayer / 2;
        if (keyIsDown(83)){
          // if you are pressing "s"
          // reset the gravity and go
          currentGravity[currentGravityIndex].dy = currentGravity[currentGravityIndex].dyOriginal;
          move = false;
        }
      }

      // make sure dont go over the bottom same logic as if heart is throwing down excempt no changing the gravity index
      platformEdge = currentPlatformEdge[platformEdgeOrder.get("down")];
      if (
        player.y < platformEdge.y &&
        platformEdge.x + platformEdge.l / 2 > player.x - heart.width * scaleOfPlayer / 2 &&
        platformEdge.x - platformEdge.l / 2 < player.x + heart.width * scaleOfPlayer / 2 &&
        player.y + heart.height * scaleOfPlayer / 2 + gravity.dy > platformEdge.y - platformEdge.w / 2
      ) {
        // move = false so you stop moving throught the wall
        move = false;
        // hit the celing and stop the speed
        gravity.dy = 0;
        player.y = platformEdge.y - platformEdge.w / 2 - heart.height * scaleOfPlayer / 2;
      }
      

      // move left and right normally only if there is no gravity on the x direction
      if (gravity.accerlerationX === 0){
        stopAtLeft();
        stopAtRight();
      }

      // if you stoped clicking the s button then you immidiately stop going
      if (gravity.dy > 0 && !keyIsDown(83)){
        gravity.dy = 0;
      }

      // if will not break the barrier then
      if (move) {
        // move player by the dy
        player.y += gravity.dy;
        // dy accelerates
        gravity.dy += gravity.accerlerationY;
      }
    } if (gravity.accerlerationY > 0) {
      //gravity is accelerating dwnnwards
      //initialize move and the platform
      let move = true;
      let platformEdge = currentPlatformEdge[platformEdgeOrder.get("down")];
      // if player is above the platform
      // and if the [right side of the platform] covers (aka > than)  [left side of the player]
      // and if the [left side of the platform] covers (aka < than)  [right side of the player]
      // and if the [bottom of the player] + gravity.dy is below (aka > than) [the top of the edge]
      // then you will go throught the wall. Thus hit the ground
      if (
        player.y < platformEdge.y &&
        platformEdge.x + platformEdge.l / 2 > player.x - heart.width * scaleOfPlayer / 2 &&
        platformEdge.x - platformEdge.l / 2 < player.x + heart.width * scaleOfPlayer / 2 &&
        player.y + heart.height * scaleOfPlayer / 2 + gravity.dy > platformEdge.y - platformEdge.w / 2
      ) {
        // move = false so you stop moving throught the wall
        move = false;
        // gravity index change mode since you hit the ground
        if (currentGravityIndex === 0){
          currentGravityIndex = 1;
          attackInitialTime = millis();
        }
        // place the player at the top of bottom edge
        player.y = platformEdge.y - platformEdge.w / 2 - heart.height * scaleOfPlayer / 2;
        if (keyIsDown(87)){
          // if you are pressing "w"
          // reset the gravity and go
          currentGravity[currentGravityIndex].dy = currentGravity[currentGravityIndex].dyOriginal;
          // move is still false because you updated the current gravity indext but not the gravity yet
          // try next time
          move = false;
        }
      }

      // make sure dont go over the top same logic as if heart is throwing up excempt no changing the gravity index
      platformEdge = currentPlatformEdge[platformEdgeOrder.get("up")];
      if (
        player.y > platformEdge.y &&
        platformEdge.x + platformEdge.l / 2 > player.x - heart.width * scaleOfPlayer / 2 &&
        platformEdge.x - platformEdge.l / 2 < player.x + heart.width * scaleOfPlayer / 2 &&
        player.y - heart.height * scaleOfPlayer / 2 + gravity.dy < platformEdge.y + platformEdge.w / 2
      ) {
        // move = false so you stop moving throught the wall
        move = false;
        // hit the floor and stop speed
        gravity.dy = 0;
        player.y = platformEdge.y + platformEdge.w / 2 + heart.height * scaleOfPlayer / 2;
      }

      // move left and right normally only if there is no gravity on the x direction
      if (gravity.accerlerationX === 0){
        stopAtLeft();
        stopAtRight();
      }

      // if you stoped clicking the s button then you immidiately stop going
      if (gravity.dy < 0 && !keyIsDown(87)){
        gravity.dy = 0;
      }

      // if will not break the barrier then
      if (move) {
        // move player by the dy
        player.y += gravity.dy;
        // dy accelerates
        gravity.dy += gravity.accerlerationY;
      }
    } if (gravity.accerlerationX > 0) {
      //gravity is accelerating towards right
      //initialize move and the up platform
      let move = true;
      let platformEdge = currentPlatformEdge[platformEdgeOrder.get("right")];
      // if player is on the left of platform
      // and if the [bottom of the platform] covers (aka > than)  [top of the player]
      // and if the [top of the platform] covers (aka < than)  [bottom of the player]
      // and if the [right of the player] + gravity.dy is more right (aka > than) [left of the edge]
      // then you will go throught the wall. Thus hit the ground
      if (
        player.x < platformEdge.x &&
        platformEdge.y + platformEdge.w / 2 > player.y - heart.height * scaleOfPlayer / 2 &&
        platformEdge.y - platformEdge.w / 2 < player.y + heart.height * scaleOfPlayer / 2 &&
        player.x + heart.width * scaleOfPlayer / 2 + gravity.dx > platformEdge.x - platformEdge.l / 2
      ) {
        // move = false so you stop moving throught the wall
        move = false;
        // gravity index change mode since you hit the ground
        if (currentGravityIndex === 0){
          currentGravityIndex = 1;
          attackInitialTime = millis();
        }
        // place the player's right at the left of the right edge
        player.x = platformEdge.x - platformEdge.l / 2 - heart.width * scaleOfPlayer / 2;
        if (keyIsDown(65)){
          // if you are pressing "a"
          // reset the gravity and go
          currentGravity[currentGravityIndex].dx = currentGravity[currentGravityIndex].dxOriginal;
          move = false;
        }
      }
      

      // move up and down normally only if there is no gravity on the x direction
      if (gravity.accerlerationY === 0){
        stopAtUp();
        stopAtDown();
      }

      // if you stoped clicking the a button then you immidiately stop going
      if (gravity.dx < 0 && !keyIsDown(65)){
        gravity.dx = 0;
      }

      // if will not break the barrier then
      if (move) {
        // move player by the dx
        player.x += gravity.dx;
        // dy accelerates
        gravity.dx += gravity.accerlerationX;
      }
    } if (gravity.accerlerationX < 0) {
      //gravity is accelerating towards left
      //initialize move and the up platform
      let move = true;
      let platformEdge = currentPlatformEdge[platformEdgeOrder.get("left")];
      // if player is on the right of platform
      // and if the [bottom of the platform] covers (aka > than)  [top of the player]
      // and if the [top of the platform] covers (aka < than)  [bottom of the player]
      // and if the [left of the player] + gravity.dy is more left (aka < than) [right of the edge]
      // then you will go throught the wall. Thus hit the ground

      if (
        player.x > platformEdge.x &&
        platformEdge.y + platformEdge.w / 2 > player.y - heart.height * scaleOfPlayer / 2 &&
        platformEdge.y - platformEdge.w / 2 < player.y + heart.height * scaleOfPlayer / 2 &&
        player.x - heart.width * scaleOfPlayer / 2 + gravity.dx < platformEdge.x + platformEdge.l / 2
      ) {
        // move = false so you stop moving throught the wall
        move = false;
        // gravity index change mode since you hit the ground
        if (currentGravityIndex === 0){
          currentGravityIndex = 1;
          attackInitialTime = millis();
        }
        // place the player's left at the right of the left edge
        player.x = platformEdge.x + platformEdge.l / 2 + heart.width * scaleOfPlayer / 2;
        if (keyIsDown(68)){
          // if you are pressing "d"
          // reset the gravity and go
          currentGravity[currentGravityIndex].dx = currentGravity[currentGravityIndex].dxOriginal;
          move = false;
        }        
      }
      
      // move up and down normally only if there is no gravity on the x direction
      if (gravity.accerlerationY === 0){
        stopAtUp();
        stopAtDown();
      }

      // if you stoped clicking the a button then you immidiately stop going
      if (gravity.dx > 0 && !keyIsDown(68)){
        gravity.dx = 0;
      }
      
      // if will not break the barrier then
      if (move) {
        // move player by the dx
        player.x += gravity.dx;
        // dy accelerates
        gravity.dx += gravity.accerlerationX;
      }
    }
  }
} 

// load levels
function innit(){
  // innitialize the starting x,y position of the heart // reset timer // only run it once per level COMPLETED

  // innitail spawn
  if(level === 1){
    // load attack
    loadLevel1All();

    // mid mid spawn
    player.x = currentPlatformEdge[2].x;
    player.y = currentPlatformEdge[1].y;
  }
  if(level === 2){
    // load attack
    loadLevel2All();

    // bottom mid spawn
    player.x = currentPlatformEdge[platformEdgeOrder.get("down")].x;
    // the y need to stand on top of the edge
    player.y = currentPlatformEdge[platformEdgeOrder.get("down")].y
    - currentPlatformEdge[platformEdgeOrder.get("down")].w / 2 
    - heart.height * scaleOfPlayer / 2;
  }
  // reset timer
  attackInitialTime = millis();
} function loadLevel1All(){
  // level 1 innit COMPLETED
  // platformEdge COMPLETED
  let platformEdge1={x: 0.5 * height,y: 0.5 * height,l: 0.26 * height,w: 0.01 * height};
  let platformEdge2={x: 0.375 * height,y: 0.625 * height,l: 0.01 * height,w: 0.26 * height};
  let platformEdge3={x: 0.5 * height,y: 0.75 * height,l: 0.26 * height,w: 0.01 * height};
  let platformEdge4={x: 0.625 * height,y: 0.625 * height,l: 0.01 * height,w: 0.26 * height};
  // let platformEdge1={x: 0.5,y: 0,l: 1,w: 0.025}; up
  // let platformEdge2={x: 0,y: 0.5,l: 0.025,w: 1}; left
  // let platformEdge3={x: 0.5,y: 1,l: 1,w: 0.025}; down
  // let platformEdge4={x: 1,y: 0.5,l: 0.025,w: 1}; right
  let level1PlatformEdge = [platformEdge1,platformEdge2,platformEdge3,platformEdge4];
  currentPlatformEdge = level1PlatformEdge;

  // bones COMPLETD
  // attack 1
  // gravity innit COMPLETED
  let gravity1 = {
    mode: "on",
    accerlerationX: 0,
    dx: 0,
    accerlerationY: 0.3 / 662 * height,
    dy: 3 / 662 * height,
  };

  let gravity2 = {
    mode: "on",
    accerlerationX: 0,
    dx: 0,
    accerlerationY: 0.1 / 662 * height,
    dy: -3.5 / 662 * height,
    dyOriginal: -3.5 / 662 * height,
  };

  let gravity3 = {
    mode: "off",
    accerlerationX: 0.0,
    dx: 0,
    accerlerationY: 0,
    dy: 0,
  };

  currentGravity = [gravity1, gravity2, gravity3];
  currentGravityIndex = 0;

  // initialize the varible of the attack 1 level 1 COMPLETED
  let attack1 = new TabAttack(1000, 1200, 3000, 7, 400, "down", 0.08 * height, [], structuredClone(currentGravity), 1150);

  // attack1.type = "tab";
  // attack1.reaction = 1000;
  // attack1.changeTime = 1200;
  // attack1.endTime = 3000;
  // attack1.damage = 7;
  // attack1.cooldown = 400;
  // attack1.direction = "down";
  // attack1.height = 0.08 * height;
  // // attack1.currentHeight = 0;
  // attack1.zone = [];
  // attack1.gravity = structuredClone(currentGravity);
  // attack1.boneTime = 1500

  // calculated damge zone COMPLETED
  attack1.calculateDamageZone(level1PlatformEdge);
  
  // push the attack in COMPLETED
  currentAttackIndex = 0;
  currentBones = [attack1];
  
  // attack 2

  for (let i = 0; i < 6; i++){
    // random attack
    // select a random direction
    let randomNumber = floor(random(4));
    let directions = ["up", "down", "left", "right"];

    // gravity innit COMPLETED
    if (directions[randomNumber] === "down"){
      let gravity4 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: 0.5 / 662 * height,
        dy: 5 / 662 * height,
      };

      let gravity5 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: 0.1 / 662 * height,
        dy: -3.5 / 662 * height,
        dyOriginal: -3.5 / 662 * height,
      };

      let gravity6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravity4,gravity5,gravity6];
    }

    if (directions[randomNumber] === "up"){
      let gravity4 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: -0.9 / 662 * height,
        dy: -9 / 662 * height,
      };

      let gravity5 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: -0.1 / 662 * height,
        dy: 3.5 / 662 * height,
        dyOriginal: 3.5 / 662 * height,
      };

      let gravity6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravity4,gravity5,gravity6];
    }

    if (directions[randomNumber] === "right"){
      let gravity4 = {
        mode: "on",
        accerlerationX: 0.9 / 662 * height,
        dx: 9 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravity5 = {
        mode: "on",
        accerlerationX: 0.1 / 662 * height,
        dx: -3.5 / 662 * height,
        dxOriginal: -3.5 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravity6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravity4,gravity5,gravity6];
    }

    if (directions[randomNumber] === "left"){
      let gravity4 = {
        mode: "on",
        accerlerationX: -0.9 / 662 * height,
        dx: -9 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravity5 = {
        mode: "on",
        accerlerationX: -0.1 / 662 * height,
        dx: 3.5 / 662 * height,
        dxOriginal: 3.5 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravity6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravity4,gravity5,gravity6];
    }

    // initialize the varible of the attack 1 level 1 COMPLETED
    let attack2 = new TabAttack(650, 1000, 1000, 3, 150, directions[randomNumber], 0.02 * height, [], structuredClone(currentGravity), 800);

    // attack2.type = "tab";
    // attack2.reaction = 650;
    // attack2.changeTime = 1000;
    // attack2.endTime = 1000;
    // attack2.damage = 3;
    // attack2.cooldown = 150;
    // attack2.direction = directions[randomNumber];
    // attack2.height = 0.02 * height;
    // // attack2.currentHeight = 0.02 * height;
    // attack2.zone = [];
    // attack2.gravity = structuredClone(currentGravity);
    // attack2.boneTime = 800

    // calculated damge zone COMPLETED
    attack2.calculateDamageZone(level1PlatformEdge);

    // push the attack in COMPLETED
    currentBones.push(attack2);
  }

  // attack last or attack 3
  let attackLast = {type: "next round"};
  currentBones.push(attackLast);

  currentGravity = [gravity1,gravity2,gravity3];
  
} function loadLevel2All(){
  // level 2 innit COMPLETED
  // platformEdge COMPLETED
  let platformEdge1={x: 0.5 * height,y: 0.5 * height,l: 0.51 * height,w: 0.01 * height};
  let platformEdge2={x: 0.25 * height,y: 0.625 * height,l: 0.01 * height,w: 0.26 * height};
  let platformEdge3={x: 0.5 * height,y: 0.75 * height,l: 0.51 * height,w: 0.01 * height};
  let platformEdge4={x: 0.75 * height,y: 0.625 * height,l: 0.01 * height,w: 0.26 * height};
  // let platformEdge1={x: 0.5,y: 0,l: 1,w: 0.025}; top
  // let platformEdge2={x: 0,y: 0.5,l: 0.025,w: 1}; left
  // let platformEdge3={x: 0.5,y: 1,l: 1,w: 0.025}; down
  // let platformEdge4={x: 1,y: 0.5,l: 0.025,w: 1}; right
  let level2PlatformEdge = [platformEdge1,platformEdge2,platformEdge3,platformEdge4];
  currentPlatformEdge = level2PlatformEdge;

  // bones COMPLETD
  // attack 1
  // gravity innit COMPLETED
  let gravity1 = {
    mode: "on",
    accerlerationX: 0,
    dx: 0,
    accerlerationY: 0.3 / 662 * height,
    dy: 3 / 662 * height,
  };

  let gravity2 = {
    mode: "on",
    accerlerationX: 0,
    dx: 0,
    accerlerationY: 0.1 / 662 * height,
    dy: -3.5 / 662 * height,
    dyOriginal: -3.5 / 662 * height,
  };

  let gravity3 = {
    mode: "off",
    accerlerationX: 0.0,
    dx: 0,
    accerlerationY: 0,
    dy: 0,
  };

  currentGravity = [gravity1, gravity2, gravity3];
  currentGravityIndex = 0;

  // initialize the varible of the attack 1 level 2 COMPLETED
  let attack1 = new TabAttack(1000, 1200, 3000, 7, 400, "down", 0.08 * height, [], structuredClone(currentGravity), 1150);

  // attack1.type = "tab";
  // attack1.reaction = 1000;
  // attack1.changeTime = 1200;
  // attack1.endTime = 3000;
  // attack1.damage = 7;
  // attack1.cooldown = 400;
  // attack1.direction = "down";
  // attack1.height = 0.08 * height;
  // // attack1.currentHeight = 0;
  // attack1.zone = [];
  // attack1.gravity = structuredClone(currentGravity);
  // attack1.boneTime = 1150

  // calculated damge zone COMPLETED
  attack1.calculateDamageZone(level2PlatformEdge);
  
  // push the attack in COMPLETED
  currentAttackIndex = 0;
  currentBones = [attack1];
  
  // attack 2 TEMP

  for (let i = 0; i < 6; i++){

    let randomNumber = 1;
    let directions = ["up", "down", "left", "right"];

    // gravity
    if (directions[randomNumber] === "down"){
      let gravity4 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: 0.5 / 662 * height,
        dy: 5 / 662 * height,
      };

      let gravity5 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: 0.1 / 662 * height,
        dy: -3.5 / 662 * height,
        dyOriginal: -3.5 / 662 * height,
      };

      let gravity6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravity4,gravity5,gravity6];
    }
    if (directions[randomNumber] === "up"){
      let gravity4 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: -0.9 / 662 * height,
        dy: -9 / 662 * height,
      };

      let gravity5 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: -0.1 / 662 * height,
        dy: 3.5 / 662 * height,
        dyOriginal: 3.5 / 662 * height,
      };

      let gravity6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravity4,gravity5,gravity6];
    }
    if (directions[randomNumber] === "right"){
      let gravity4 = {
        mode: "on",
        accerlerationX: 0.9 / 662 * height,
        dx: 9 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravity5 = {
        mode: "on",
        accerlerationX: 0.1 / 662 * height,
        dx: -3.5 / 662 * height,
        dxOriginal: -3.5 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravity6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravity4,gravity5,gravity6];
    }
    if (directions[randomNumber] === "left"){
      let gravity4 = {
        mode: "on",
        accerlerationX: -0.9 / 662 * height,
        dx: -9 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravity5 = {
        mode: "on",
        accerlerationX: -0.1 / 662 * height,
        dx: 3.5 / 662 * height,
        dxOriginal: 3.5 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravity6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravity4,gravity5,gravity6];
    }

    currentGravity = [gravity1, gravity2, gravity3];
    currentGravityIndex = 0;

    let attack2 = {
      type: "gap",
      reaction: 700,
      boneSpeedLeft: 1000,
      boneSpeedRight: 1000,
      endTime: 1300,
      gapHeight: 0.15,
      gapWidth: 0.04,
      gapDifference: 0.12,
      damage: 3,
      cooldown: 50,
      direction: directions[randomNumber],
      zone: [],
      gravity: structuredClone(currentGravity),
    };

    attack2.gapHeight = attack2.gapHeight * (level2PlatformEdge[platformEdgeOrder.get("left")].w - level2PlatformEdge[platformEdgeOrder.get("down")].w - level2PlatformEdge[platformEdgeOrder.get("up")].w);
    attack2.gapDifference = attack2.gapDifference * (level2PlatformEdge[platformEdgeOrder.get("left")].w - level2PlatformEdge[platformEdgeOrder.get("down")].w - level2PlatformEdge[platformEdgeOrder.get("up")].w);
    attack2.gapWidth = attack2.gapWidth * (level2PlatformEdge[platformEdgeOrder.get("down")].l - level2PlatformEdge[platformEdgeOrder.get("left")].l - level2PlatformEdge[platformEdgeOrder.get("right")].l);
    if (attack2.direction === "down"){
      attack2.zone = [
        [
          level2PlatformEdge[platformEdgeOrder.get("left")].x - 0,
          level2PlatformEdge[platformEdgeOrder.get("up")].y + level2PlatformEdge[platformEdgeOrder.get("up")].w / 2 + level2PlatformEdge[platformEdgeOrder.get("left")].w / 2 - level2PlatformEdge[platformEdgeOrder.get("down")].w / 2 - level2PlatformEdge[platformEdgeOrder.get("up")].w / 2 - attack2.gapHeight / 2 - attack2.gapDifference / 2,
          attack2.gapWidth,
          level2PlatformEdge[platformEdgeOrder.get("up")].w / 2 + (level2PlatformEdge[platformEdgeOrder.get("left")].w - level2PlatformEdge[platformEdgeOrder.get("down")].w - level2PlatformEdge[platformEdgeOrder.get("up")].w) - attack2.gapHeight - attack2.gapDifference
        ],
        [
          level2PlatformEdge[platformEdgeOrder.get("left")].x - 0,
          level2PlatformEdge[platformEdgeOrder.get("down")].y - level2PlatformEdge[platformEdgeOrder.get("down")].w / 2 - attack2.gapHeight / 2,
          attack2.gapWidth,
          attack2.gapHeight
        ],
        [
          level2PlatformEdge[platformEdgeOrder.get("right")].x - 0,
          level2PlatformEdge[platformEdgeOrder.get("up")].y + level2PlatformEdge[platformEdgeOrder.get("up")].w / 2 + level2PlatformEdge[platformEdgeOrder.get("left")].w / 2 - level2PlatformEdge[platformEdgeOrder.get("down")].w / 2 - level2PlatformEdge[platformEdgeOrder.get("up")].w / 2 - attack2.gapHeight / 2 - attack2.gapDifference / 2,
          attack2.gapWidth,
          level2PlatformEdge[platformEdgeOrder.get("up")].w / 2 + (level2PlatformEdge[platformEdgeOrder.get("left")].w - level2PlatformEdge[platformEdgeOrder.get("down")].w - level2PlatformEdge[platformEdgeOrder.get("up")].w) - attack2.gapHeight - attack2.gapDifference
        ],
        [
          level2PlatformEdge[platformEdgeOrder.get("right")].x - 0,
          level2PlatformEdge[platformEdgeOrder.get("down")].y - level2PlatformEdge[platformEdgeOrder.get("down")].w / 2 - attack2.gapHeight / 2,
          attack2.gapWidth,
          attack2.gapHeight
        ]
      ];
    }
    if (attack2.direction === "up"){
      attack2.zone = [
        [
          level2PlatformEdge[platformEdgeOrder.get("left")].x - 0,
          level2PlatformEdge[platformEdgeOrder.get("down")].y - level2PlatformEdge[platformEdgeOrder.get("down")].w / 2 - attack2.gapHeight / 2,
          attack2.gapWidth,
          attack2.gapHeight
        ],
        [
          level2PlatformEdge[platformEdgeOrder.get("left")].x - 0,
          level2PlatformEdge[platformEdgeOrder.get("up")].y + level2PlatformEdge[platformEdgeOrder.get("up")].w / 2 + (level2PlatformEdge[platformEdgeOrder.get("left")].w - level2PlatformEdge[platformEdgeOrder.get("down")].w - level2PlatformEdge[platformEdgeOrder.get("up")].w) - attack2.gapHeight - attack2.gapDifference,
          attack2.gapWidth,
          attack2.gapHeight
        ],
        [
          level2PlatformEdge[platformEdgeOrder.get("right")].x - 0,
          level2PlatformEdge[platformEdgeOrder.get("down")].y - level2PlatformEdge[platformEdgeOrder.get("down")].w / 2 - attack2.gapHeight / 2,
          attack2.gapWidth,
          attack2.gapHeight
        ],
        [
          level2PlatformEdge[platformEdgeOrder.get("right")].x - 0,
          level2PlatformEdge[platformEdgeOrder.get("down")].y - level2PlatformEdge[platformEdgeOrder.get("down")].w / 2 - attack2.gapHeight / 2,
          attack2.gapWidth,
          attack2.gapHeight
        ]
      ];
    }
    // if (attack2.direction === "left"){
    //   attack2.zone = [
    //     level2PlatformEdge[platformEdgeOrder.get("left")].x + level2PlatformEdge[platformEdgeOrder.get("left")].l / 2 + attack2.height / 2,
    //     level2PlatformEdge[platformEdgeOrder.get("left")].y,
    //     attack2.height,
    //     level2PlatformEdge[platformEdgeOrder.get("left")].w - level2PlatformEdge[platformEdgeOrder.get("up")].w - level2PlatformEdge[platformEdgeOrder.get("down")].w
    //   ];
    // }
    // if (attack2.direction === "right"){
    //   attack2.zone = [
    //     level2PlatformEdge[platformEdgeOrder.get("right")].x - level2PlatformEdge[platformEdgeOrder.get("right")].l / 2 - attack2.height / 2,
    //     level2PlatformEdge[platformEdgeOrder.get("right")].y,
    //     attack2.height,
    //     level2PlatformEdge[platformEdgeOrder.get("right")].w - level2PlatformEdge[platformEdgeOrder.get("up")].w - level2PlatformEdge[platformEdgeOrder.get("down")].w
    //   ];
    // }
    currentBones.push(attack2);
  }

  // attack last
  let attackLast = {type: "next round"};
  currentBones.push(attackLast);

  currentGravity = [gravity1,gravity2,gravity3];
  
}

// stop functions COMPLETED
function stopAtRight(){
  if (keyIsDown(68)){
    //d
    let move = true;
    for (let platformEdge of currentPlatformEdge) {
      if (
        player.x < platformEdge.x &&
        platformEdge.y + platformEdge.w / 2 > player.y - heart.height * scaleOfPlayer / 2 &&
        platformEdge.y - platformEdge.w / 2 < player.y + heart.height * scaleOfPlayer / 2 &&
        player.x + heart.width * scaleOfPlayer / 2 + player.dx > platformEdge.x - platformEdge.l / 2
      ) {
        move = false;
        player.x = platformEdge.x - platformEdge.l / 2 - heart.width * scaleOfPlayer / 2;
      }
    }
    if (move) {
      player.x += player.dx;
    }
  }  
} function stopAtLeft(){
  if (keyIsDown(65)) {
    //a
    let move = true;
    for (let platformEdge of currentPlatformEdge) {
      if (
        player.x > platformEdge.x &&
        platformEdge.y + platformEdge.w / 2 > player.y - heart.height * scaleOfPlayer / 2 &&
        platformEdge.y - platformEdge.w / 2 < player.y + heart.height * scaleOfPlayer / 2 &&
        player.x - heart.width * scaleOfPlayer / 2 - player.dx < platformEdge.x + platformEdge.l / 2
      ) {
        move = false;
        player.x = platformEdge.x + platformEdge.l / 2 + heart.width * scaleOfPlayer / 2;
      }
    }
    if (move) {
      player.x -= player.dx;
    }
  }
} function stopAtUp(){
  if (keyIsDown(87)) {
    //w
    let move = true;
    for (let platformEdge of currentPlatformEdge) {
      if (
        player.y > platformEdge.y &&
        platformEdge.x + platformEdge.l / 2 > player.x - heart.width * scaleOfPlayer / 2 &&
        platformEdge.x - platformEdge.l / 2 < player.x + heart.width * scaleOfPlayer / 2 &&
        player.y - heart.height * scaleOfPlayer / 2 - player.dy < platformEdge.y + platformEdge.w / 2
      ) {
        move = false;
        player.y = platformEdge.y + platformEdge.w / 2 + heart.height * scaleOfPlayer / 2;
      }
    }
    if (move) {
      player.y -= player.dy;
    }
  }  
} function stopAtDown(){
  if (keyIsDown(83)) {
    //s
    let move = true;
    for (let platformEdge of currentPlatformEdge) {
      if (
        player.y < platformEdge.y &&
        platformEdge.x + platformEdge.l / 2 > player.x - heart.width * scaleOfPlayer / 2 &&
        platformEdge.x - platformEdge.l / 2 < player.x + heart.width * scaleOfPlayer / 2 &&
        player.y + heart.height * scaleOfPlayer / 2 + player.dy > platformEdge.y - platformEdge.w / 2
      ) {
        move = false;
        player.y = platformEdge.y - platformEdge.w / 2 - heart.height * scaleOfPlayer / 2;
      }
    }
    if (move) {
      player.y += player.dy;
    }
  }
}

// music
function mouseReleased(){
  if (startMusic){
    finishLoad.then(function () {
      megalovania.jump(0);
      megalovania.setLoop(true);
      megalovania.play();
      startMusic = false;
    }).catch(function () {
      console.log("Sorry Pending");
    });
  }
}