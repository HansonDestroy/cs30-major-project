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
  constructor(reaction,changeTime,endTime,damage,cooldown,direction,height,zone,gravitaty){
    // innit varible COMPLETED
    this.type = "tab";
    this.reaction = reaction;
    this.changeTime = changeTime;
    this.endTime = endTime;
    this.damage = damage;
    this.cooldown = cooldown;
    this.direction = direction;
    this.height = this.height * height;
    this.zone = zone;
    this.gravitaty = gravitaty;
  }


  // calculate zone function
  calculateDamageZone(platformEdge){
    // draw the right damge zone at the right place. very hard I wish not to look back at it. COMPLETED
    if (this.direction === "up"){
      this.zone = [
        platformEdge[platformEdgeOrder.up].x,
        platformEdge[platformEdgeOrder.up].y
        + platformEdge[platformEdgeOrder.down].w / 2
        + this.height / 2,
        platformEdge[platformEdgeOrder.up].l
        - platformEdge[platformEdgeOrder.left].l
        - platformEdge[platformEdgeOrder.right].l,
        this.height
      ];
    }
    if (this.direction === "down"){
      this.zone = [
        platformEdge[platformEdgeOrder.down].x,
        platformEdge[platformEdgeOrder.down].y
        - platformEdge[platformEdgeOrder.down].w / 2
        - this.height / 2,
        platformEdge[platformEdgeOrder.down].l
        - platformEdge[platformEdgeOrder.left].l
        - platformEdge[platformEdgeOrder.right].l,
        this.height
      ];
    }
    if (this.direction === "left"){
      this.zone = [
        platformEdge[platformEdgeOrder.left].x
        + platformEdge[platformEdgeOrder.left].l / 2
        + this.height / 2,
        platformEdge[platformEdgeOrder.left].y,
        this.height,
        platformEdge[platformEdgeOrder.left].w
        - platformEdge[platformEdgeOrder.up].w
        - platformEdge[platformEdgeOrder.down].w
      ];
    }
    if (this.direction === "right"){
      this.zone = [
        platformEdge[platformEdgeOrder.right].x
        - platformEdge[platformEdgeOrder.right].l / 2
        - this.height / 2,
        platformEdge[platformEdgeOrder.right].y,
        this.height,
        platformEdge[platformEdgeOrder.right].w
        - platformEdge[platformEdgeOrder.up].w
        - platformEdge[platformEdgeOrder.down].w
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
    this.x = 0
    this.y = 0
    this.dx = 0.005
    this.dy = 0.005
    this.health = 92
  }

  displayImage(imageName){
    if (imageName == "heart"){
      image(heart, this.x, this.y, heart.width * scaleOfPlayer, heart.height * scaleOfPlayer);
    }
    if (imageName == "down"){
      image(heartDown, this.x, this.y, heartDown.width * scaleOfPlayer, heartDown.height * scaleOfPlayer);
    }
    if (imageName == "up"){
      image(heartUp, this.x, this.y, heartUp.width * scaleOfPlayer, heartUp.height * scaleOfPlayer);
    }
    if (imageName == "right"){
      image(heartRight, this.x, this.y, heartRight.width * scaleOfPlayer, heartRight.height * scaleOfPlayer);
    }
    if (imageName == "left"){
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
let attackInitialTime;
// last time damage is taken
let damageLastTime = 0;

// make sure that innit is only triggered once per level
let inttailizedAready = "no";
// throw away useless varible
let startMusic = false;

let platformEdgeOrder = {
  up : 0,
  left : 1,
  down: 2,
  right : 3,
};


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



// useful functions that is COMPLETED
function preload() {
  // preload COMPLETED
  heart = loadImage("assets/image/heart.png");
  heartDown = loadImage("assets/image/heartDown.png");
  heartUp = loadImage("assets/image/heartUp.png");
  heartLeft = loadImage("assets/image/heartLeft.png");
  heartRight = loadImage("assets/image/heartRight.png");
} function setup() {
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
  // load level 1
  loadLevel1All();  
} function draw() {
  // draw TEMP
  background(100);
  if (state === "starting screen"){
    drawStartScreen();
  }
  else if (state !== "death"){
    //initailize COMPLETED
    innit();
    // display bones TEMP
    displayBones();
    // display platform edge COMPLETED
    displayPlatformEdge();
    // move player TEMP
    movePlayer();
    // display player TEMP
    displayPlayer();

    // health bar and health COMPLETED
    text(player.health,50,50);
    rect(300,50,player.health*2,30);
    if (player.health < 0){
      state = "death";
    }
    
    // display the text of actions
    textAlign(LEFT);
    for (let actionText of actions){
      text(actionText.word,actionText.positionX,actionText.positionY);
    }

    // if the attack type is next round then it is the last atack thus advance level
    if (currentBones[currentAttackIndex].type === "next round"){
      state = "action time";
    }

    // a way to track the player DEBUG
    // line(player.x, 0, player.x, height);
    // line(0, player.y, width, player.y);
    // circle(player.x, player.y, heart.width * scaleOfPlayer)
  }
  else{
    background(0);
    fill("white");
    text("die",50,50);
  }
} function drawStartScreen(){
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
  player.x = HEART_X * width
  player.y = (MODE_HEIGHT + MODE_HEIGHT_DIFFERENCE * modes[mode].position) * height
  player.displayImage("heart")

} function keyTyped(){
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
      console.log("total reset");
      level++;
      inttailizedAready = "no";
      takeAction();
    }
    action += modes.length;
    action = action % actions.length;
  }
  
} function innit(){
  // innitialize the starting x,y position of the heart // reset timer // only run it once per level COMPLETED
  if(inttailizedAready === "no"){
    // innitail spawn
    if(level === 1){
      // mid mid
      player.x = currentPlatformEdge[2].x;
      player.y = currentPlatformEdge[1].y;
    }
    if(level === 2){
      // bottom mid
      player.x = currentPlatformEdge[platformEdgeOrder.down].x;
      // the y need to stand on top of the edge
      player.y = currentPlatformEdge[platformEdgeOrder.down].y
      - currentPlatformEdge[platformEdgeOrder.down].w / 2 
      - heart.height * scaleOfPlayer / 2;
    }
    // reset timer
    attackInitialTime = millis();
    // only run it once per level
    inttailizedAready = "yes";
  }
}

function displayBones(){
  // TEMP
  // innitialize varible
  let currentMillis = millis();
  let attack = currentBones[currentAttackIndex];
  if (attack.type === "tab"){
    // the attack is tab

    // draw the zone and determine if damage need to be taken TEMP
    // need to seperate the two function COMPLETE 
    if (currentMillis - attackInitialTime < attack.reaction){
      // if the time elapsed in this level(currentMillis - time) is within(<) the reaction time(attack.reaction)
      // then color the zone green as warning

      // note if it is dropping to the ground at gravity1 or gravityIndex == 0 then do not display the box at all TEMP
      if (currentGravityIndex !== 0 || true){
        // condition met draw green zone
        rectMode(CENTER);
        fill(0,150,0);
        rect(attack.zone[0],attack.zone[1],attack.zone[2],attack.zone[3]);
      }

      // animation of sans throwing his hands down OPTIONAL
    } else{
      // your reation time have passed
      // therefore your grace period is over and the zone is filled with white now
      rectMode(CENTER);
      fill(150,150,150);
      rect(attack.zone[0],attack.zone[1],attack.zone[2],attack.zone[3]);
      
      // take damage
      attack.takeDamage(currentMillis);
    }

    // 
    if (currentMillis - attackInitialTime > attack.changeTime){
      currentGravityIndex = 2;
    } else if(currentGravityIndex === 2){
      currentGravityIndex--;
      if (attack.direction === "down" || attack.direction === "up"){
        currentGravity[currentGravityIndex].dy = currentGravity[currentGravityIndex].dyOriginal;
      }
      if (attack.direction === "left" || attack.direction === "right"){
        currentGravity[currentGravityIndex].dx = currentGravity[currentGravityIndex].dxOriginal;
      }
    }

    if (currentMillis - attackInitialTime > attack.endTime){
      currentAttackIndex++;
      attackInitialTime = millis();
      currentGravityIndex = 0;
      currentGravity = currentBones[currentAttackIndex].gravitaty;
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

    if (currentMillis - attackInitialTime > attack.changeTime){
      currentGravityIndex = 2;
    }
    else if(currentGravityIndex === 2){
      currentGravityIndex--;
      if (attack.direction === "down" || attack.direction === "up"){
        currentGravity[currentGravityIndex].dy = currentGravity[currentGravityIndex].dyOriginal;
      }
      if (attack.direction === "left" || attack.direction === "right"){
        currentGravity[currentGravityIndex].dx = currentGravity[currentGravityIndex].dxOriginal;
      }
    }

    if (currentMillis - attackInitialTime > attack.endTime){
      currentAttackIndex++;
      attackInitialTime = millis();
      currentGravityIndex = 0;
      currentGravity = currentBones[currentAttackIndex].gravitaty;
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
} function movePlayer() {
  // TEMP
  if (currentBones[currentAttackIndex].type === "next round"){
    // if the attack type is next round then
    // make the heart go to the right place 
    player.x = actions[action].positionX;
    player.y = actions[action].positionY;
  } else{
    let gravitaty = currentGravity[currentGravityIndex];
    if(gravitaty.mode === "off"){
      stopDown();
      stopUp();
      stopLeft();
      stopRight();
    }
    else{
      if (gravitaty.accerlerationY < 0) {
        //throw up
        let move = true;
        for (let platformEdge of currentPlatformEdge) {
          if (
            player.y > platformEdge.y &&
            platformEdge.x + platformEdge.l / 2 > player.x - heart.width * scaleOfPlayer / 2 &&
            platformEdge.x - platformEdge.l / 2 < player.x + heart.width * scaleOfPlayer / 2 &&
            player.y - heart.height * scaleOfPlayer / 2 + gravitaty.dy < platformEdge.y + platformEdge.w / 2
          ) {
            move = false;
            if (keyIsDown(83)){
              currentGravityIndex++;
            }
            player.y = platformEdge.y + platformEdge.w / 2 + heart.height * scaleOfPlayer / 2;
          }
        }

        if (keyIsDown(65)){
          stopLeft();
        }
        else if (keyIsDown(68)){
          stopRight();
        }

        if (gravitaty.dy > 0 && !keyIsDown(83)){
          gravitaty.dy = 0;
        }

        if (move) {
          player.y += gravitaty.dy;
          gravitaty.dy += gravitaty.accerlerationY;
        }
      }
      if (gravitaty.accerlerationY > 0) {
        //s
        let move = true;
        for (let platformEdge of currentPlatformEdge) {
          if (
            player.y < platformEdge.y &&
            platformEdge.x + platformEdge.l / 2 > player.x - heart.width * scaleOfPlayer / 2 &&
            platformEdge.x - platformEdge.l / 2 < player.x + heart.width * scaleOfPlayer / 2 &&
            player.y + heart.height * scaleOfPlayer / 2 + gravitaty.dy > platformEdge.y - platformEdge.w / 2
          ) {
            move = false;
            player.y = platformEdge.y - platformEdge.w / 2 - heart.height * scaleOfPlayer / 2;
            if (keyIsDown(87)){
              currentGravityIndex++;
            }
          }
        }
        
        if (keyIsDown(65)){
          stopLeft();
        }
        else if (keyIsDown(68)){
          stopRight();
        }

        if (gravitaty.dy < 0 && !keyIsDown(87)){
          gravitaty.dy = 0;
        }

        if (move) {
          player.y += gravitaty.dy;
          gravitaty.dy += gravitaty.accerlerationY;
        }

      }
      if (gravitaty.accerlerationX > 0) {
        //d
        let move = true;
        for (let platformEdge of currentPlatformEdge) {
          if (
            player.x < platformEdge.x &&
            platformEdge.y + platformEdge.w / 2 > player.y - heart.height * scaleOfPlayer / 2 &&
            platformEdge.y - platformEdge.w / 2 < player.y + heart.height * scaleOfPlayer / 2 &&
            player.x + heart.width * scaleOfPlayer / 2 + gravitaty.dx > platformEdge.x - platformEdge.l / 2
          ) {
            move = false;
            if (keyIsDown(65)){
              currentGravityIndex++;
            }
            player.x = platformEdge.x - platformEdge.l / 2 - heart.width * scaleOfPlayer / 2;
          }
        }

        if (keyIsDown(87)){
          stopUp();
        }
        else if (keyIsDown(83)){
          stopDown();
        }

        if (gravitaty.dx < 0 && !keyIsDown(65)){
          gravitaty.dx = 0;
        }
        if (move) {
          player.x += gravitaty.dx;
          gravitaty.dx += gravitaty.accerlerationX;
        }
      }
      if (gravitaty.accerlerationX < 0) {
        //a
        let move = true;
        for (let platformEdge of currentPlatformEdge) {
          if (
            player.x > platformEdge.x &&
            platformEdge.y + platformEdge.w / 2 > player.y - heart.height * scaleOfPlayer / 2 &&
            platformEdge.y - platformEdge.w / 2 < player.y + heart.height * scaleOfPlayer / 2 &&
            player.x - heart.width * scaleOfPlayer / 2 + gravitaty.dx < platformEdge.x + platformEdge.l / 2
          ) {
            move = false;
            if (keyIsDown(68)){
              currentGravityIndex++;
            }
            player.x = platformEdge.x + platformEdge.l / 2 + heart.width * scaleOfPlayer / 2;
          }
        }
        
        if (keyIsDown(87)){
          stopUp();
        }
        else if (keyIsDown(83)){
          stopDown();
        }

        if (gravitaty.dx > 0 && !keyIsDown(68)){
          gravitaty.dx = 0;
        }

        if (move) {
          player.x += gravitaty.dx;
          gravitaty.dx += gravitaty.accerlerationX;
        }
      }
    }
  }
} function displayPlayer(){
  // TEMP
  if (currentBones[currentAttackIndex].type === "next round"){
    player.displayImage("heart");
  }
  else{
    let attack = currentBones[currentAttackIndex];
    let gravitaty = currentGravity[currentGravityIndex];
    if (gravitaty.mode === "off"){
      player.displayImage("heart");
    }
    else{
      player.displayImage(attack.direction)
    }
  }
} 

// load levels
function takeAction(){
  if (level === 1){
    loadLevel1All();
  }
  if (level === 2){
    loadLevel2All();
  }
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
  let gravitaty1 = {
    mode: "on",
    accerlerationX: 0,
    dx: 0,
    accerlerationY: 0.3 / 662 * height,
    dy: 3 / 662 * height,
  };

  let gravitaty2 = {
    mode: "on",
    accerlerationX: 0,
    dx: 0,
    accerlerationY: 0.1 / 662 * height,
    dy: -3.5 / 662 * height,
    dyOriginal: -3.5 / 662 * height,
  };

  let gravitaty3 = {
    mode: "off",
    accerlerationX: 0.0,
    dx: 0,
    accerlerationY: 0,
    dy: 0,
  };

  currentGravity = [gravitaty1, gravitaty2, gravitaty3];
  currentGravityIndex = 0;

  // initialize the varible of the attack 1 level 1 COMPLETED
  let attack1 = new TabAttack();

  attack1.type = "tab";
  attack1.reaction = 1000;
  attack1.changeTime = 1200;
  attack1.endTime = 3000;
  attack1.damage = 7;
  attack1.cooldown = 400;
  attack1.direction = "down";
  attack1.height = 0.08 * height;
  attack1.zone = [];
  attack1.gravitaty = structuredClone(currentGravity);

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
      let gravitaty4 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: 0.5 / 662 * height,
        dy: 5 / 662 * height,
      };

      let gravitaty5 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: 0.1 / 662 * height,
        dy: -3.5 / 662 * height,
        dyOriginal: -3.5 / 662 * height,
      };

      let gravitaty6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravitaty4,gravitaty5,gravitaty6];
    }

    if (directions[randomNumber] === "up"){
      let gravitaty4 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: -0.9 / 662 * height,
        dy: -9 / 662 * height,
      };

      let gravitaty5 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: -0.1 / 662 * height,
        dy: 3.5 / 662 * height,
        dyOriginal: 3.5 / 662 * height,
      };

      let gravitaty6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravitaty4,gravitaty5,gravitaty6];
    }

    if (directions[randomNumber] === "right"){
      let gravitaty4 = {
        mode: "on",
        accerlerationX: 0.9 / 662 * height,
        dx: 9 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravitaty5 = {
        mode: "on",
        accerlerationX: 0.1 / 662 * height,
        dx: -3.5 / 662 * height,
        dxOriginal: -3.5 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravitaty6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravitaty4,gravitaty5,gravitaty6];
    }

    if (directions[randomNumber] === "left"){
      let gravitaty4 = {
        mode: "on",
        accerlerationX: -0.9 / 662 * height,
        dx: -9 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravitaty5 = {
        mode: "on",
        accerlerationX: -0.1 / 662 * height,
        dx: 3.5 / 662 * height,
        dxOriginal: 3.5 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravitaty6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravitaty4,gravitaty5,gravitaty6];
    }

    // initialize the varible of the attack 1 level 1 COMPLETED
    let attack2 = new TabAttack();

    attack2.type = "tab";
    attack2.reaction = 700;
    attack2.changeTime = 1000;
    attack2.endTime = 1000;
    attack2.damage = 3;
    attack2.cooldown = 150;
    attack2.direction = directions[randomNumber];
    attack2.height = 0.02 * height;
    attack2.zone = [];
    attack2.gravitaty = structuredClone(currentGravity);

    // calculated damge zone COMPLETED
    attack2.calculateDamageZone(level1PlatformEdge);

    // push the attack in COMPLETED
    currentBones.push(attack2);
  }

  // attack last or attack 3
  let attack3 = {type: "next round"};
  currentBones.push(attack3);

  currentGravity = [gravitaty1,gravitaty2,gravitaty3];
  
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
  let gravitaty1 = {
    mode: "on",
    accerlerationX: 0,
    dx: 0,
    accerlerationY: 0.3 / 662 * height,
    dy: 3 / 662 * height,
  };

  let gravitaty2 = {
    mode: "on",
    accerlerationX: 0,
    dx: 0,
    accerlerationY: 0.1 / 662 * height,
    dy: -3.5 / 662 * height,
    dyOriginal: -3.5 / 662 * height,
  };

  let gravitaty3 = {
    mode: "off",
    accerlerationX: 0.0,
    dx: 0,
    accerlerationY: 0,
    dy: 0,
  };

  currentGravity = [gravitaty1, gravitaty2, gravitaty3];
  currentGravityIndex = 0;

  // initialize the varible of the attack 1 level 2 COMPLETED
  let attack1 = new TabAttack();

  attack1.type = "tab";
  attack1.reaction = 1000;
  attack1.changeTime = 1200;
  attack1.endTime = 3000;
  attack1.damage = 7;
  attack1.cooldown = 400;
  attack1.direction = "down";
  attack1.height = 0.08 * height;
  attack1.zone = [];
  attack1.gravitaty = structuredClone(currentGravity);

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
      let gravitaty4 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: 0.5 / 662 * height,
        dy: 5 / 662 * height,
      };

      let gravitaty5 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: 0.1 / 662 * height,
        dy: -3.5 / 662 * height,
        dyOriginal: -3.5 / 662 * height,
      };

      let gravitaty6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravitaty4,gravitaty5,gravitaty6];
    }
    if (directions[randomNumber] === "up"){
      let gravitaty4 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: -0.9 / 662 * height,
        dy: -9 / 662 * height,
      };

      let gravitaty5 = {
        mode: "on",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: -0.1 / 662 * height,
        dy: 3.5 / 662 * height,
        dyOriginal: 3.5 / 662 * height,
      };

      let gravitaty6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravitaty4,gravitaty5,gravitaty6];
    }
    if (directions[randomNumber] === "right"){
      let gravitaty4 = {
        mode: "on",
        accerlerationX: 0.9 / 662 * height,
        dx: 9 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravitaty5 = {
        mode: "on",
        accerlerationX: 0.1 / 662 * height,
        dx: -3.5 / 662 * height,
        dxOriginal: -3.5 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravitaty6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravitaty4,gravitaty5,gravitaty6];
    }
    if (directions[randomNumber] === "left"){
      let gravitaty4 = {
        mode: "on",
        accerlerationX: -0.9 / 662 * height,
        dx: -9 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravitaty5 = {
        mode: "on",
        accerlerationX: -0.1 / 662 * height,
        dx: 3.5 / 662 * height,
        dxOriginal: 3.5 / 662 * height,
        accerlerationY: 0,
        dy: 0,
      };

      let gravitaty6 = {
        mode: "off",
        accerlerationX: 0.0,
        dx: 0,
        accerlerationY: 0,
        dy: 0,
      };
      currentGravity = [gravitaty4,gravitaty5,gravitaty6];
    }

    currentGravity = [gravitaty1, gravitaty2, gravitaty3];
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
      gravitaty: structuredClone(currentGravity),
    };

    attack2.gapHeight = attack2.gapHeight * (level2PlatformEdge[platformEdgeOrder.left].w - level2PlatformEdge[platformEdgeOrder.down].w - level2PlatformEdge[platformEdgeOrder.up].w);
    attack2.gapDifference = attack2.gapDifference * (level2PlatformEdge[platformEdgeOrder.left].w - level2PlatformEdge[platformEdgeOrder.down].w - level2PlatformEdge[platformEdgeOrder.up].w);
    attack2.gapWidth = attack2.gapWidth * (level2PlatformEdge[platformEdgeOrder.down].l - level2PlatformEdge[platformEdgeOrder.left].l - level2PlatformEdge[platformEdgeOrder.right].l);
    if (attack2.direction === "down"){
      attack2.zone = [
        [
          level2PlatformEdge[platformEdgeOrder.left].x - 0,
          level2PlatformEdge[platformEdgeOrder.up].y + level2PlatformEdge[platformEdgeOrder.up].w / 2 + level2PlatformEdge[platformEdgeOrder.left].w / 2 - level2PlatformEdge[platformEdgeOrder.down].w / 2 - level2PlatformEdge[platformEdgeOrder.up].w / 2 - attack2.gapHeight / 2 - attack2.gapDifference / 2,
          attack2.gapWidth,
          level2PlatformEdge[platformEdgeOrder.up].w / 2 + (level2PlatformEdge[platformEdgeOrder.left].w - level2PlatformEdge[platformEdgeOrder.down].w - level2PlatformEdge[platformEdgeOrder.up].w) - attack2.gapHeight - attack2.gapDifference
        ],
        [
          level2PlatformEdge[platformEdgeOrder.left].x - 0,
          level2PlatformEdge[platformEdgeOrder.down].y - level2PlatformEdge[platformEdgeOrder.down].w / 2 - attack2.gapHeight / 2,
          attack2.gapWidth,
          attack2.gapHeight
        ],
        [
          level2PlatformEdge[platformEdgeOrder.right].x - 0,
          level2PlatformEdge[platformEdgeOrder.up].y + level2PlatformEdge[platformEdgeOrder.up].w / 2 + level2PlatformEdge[platformEdgeOrder.left].w / 2 - level2PlatformEdge[platformEdgeOrder.down].w / 2 - level2PlatformEdge[platformEdgeOrder.up].w / 2 - attack2.gapHeight / 2 - attack2.gapDifference / 2,
          attack2.gapWidth,
          level2PlatformEdge[platformEdgeOrder.up].w / 2 + (level2PlatformEdge[platformEdgeOrder.left].w - level2PlatformEdge[platformEdgeOrder.down].w - level2PlatformEdge[platformEdgeOrder.up].w) - attack2.gapHeight - attack2.gapDifference
        ],
        [
          level2PlatformEdge[platformEdgeOrder.right].x - 0,
          level2PlatformEdge[platformEdgeOrder.down].y - level2PlatformEdge[platformEdgeOrder.down].w / 2 - attack2.gapHeight / 2,
          attack2.gapWidth,
          attack2.gapHeight
        ]
      ];
    }
    if (attack2.direction === "up"){
      attack2.zone = [
        [
          level2PlatformEdge[platformEdgeOrder.left].x - 0,
          level2PlatformEdge[platformEdgeOrder.down].y - level2PlatformEdge[platformEdgeOrder.down].w / 2 - attack2.gapHeight / 2,
          attack2.gapWidth,
          attack2.gapHeight
        ],
        [
          level2PlatformEdge[platformEdgeOrder.left].x - 0,
          level2PlatformEdge[platformEdgeOrder.up].y + level2PlatformEdge[platformEdgeOrder.up].w / 2 + (level2PlatformEdge[platformEdgeOrder.left].w - level2PlatformEdge[platformEdgeOrder.down].w - level2PlatformEdge[platformEdgeOrder.up].w) - attack2.gapHeight - attack2.gapDifference,
          attack2.gapWidth,
          attack2.gapHeight
        ],
        [
          level2PlatformEdge[platformEdgeOrder.right].x - 0,
          level2PlatformEdge[platformEdgeOrder.down].y - level2PlatformEdge[platformEdgeOrder.down].w / 2 - attack2.gapHeight / 2,
          attack2.gapWidth,
          attack2.gapHeight
        ],
        [
          level2PlatformEdge[platformEdgeOrder.right].x - 0,
          level2PlatformEdge[platformEdgeOrder.down].y - level2PlatformEdge[platformEdgeOrder.down].w / 2 - attack2.gapHeight / 2,
          attack2.gapWidth,
          attack2.gapHeight
        ]
      ];
    }
    // if (attack2.direction === "left"){
    //   attack2.zone = [
    //     level2PlatformEdge[platformEdgeOrder.left].x + level2PlatformEdge[platformEdgeOrder.left].l / 2 + attack2.height / 2,
    //     level2PlatformEdge[platformEdgeOrder.left].y,
    //     attack2.height,
    //     level2PlatformEdge[platformEdgeOrder.left].w - level2PlatformEdge[platformEdgeOrder.up].w - level2PlatformEdge[platformEdgeOrder.down].w
    //   ];
    // }
    // if (attack2.direction === "right"){
    //   attack2.zone = [
    //     level2PlatformEdge[platformEdgeOrder.right].x - level2PlatformEdge[platformEdgeOrder.right].l / 2 - attack2.height / 2,
    //     level2PlatformEdge[platformEdgeOrder.right].y,
    //     attack2.height,
    //     level2PlatformEdge[platformEdgeOrder.right].w - level2PlatformEdge[platformEdgeOrder.up].w - level2PlatformEdge[platformEdgeOrder.down].w
    //   ];
    // }
    currentBones.push(attack2);
  }

  // attack last
  let attackLast = {type: "next round"};
  currentBones.push(attackLast);

  currentGravity = [gravitaty1,gravitaty2,gravitaty3];
  
}

// stop functions COMPLETED
// NOTIFIED THE SYSTEM WHEN HIT HARD OPTIONAL
function stopRight(){
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
} function stopLeft(){
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
} function stopUp(){
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
} function stopDown(){
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
  startMusic = true;
  if (startMusic){
    megalovania = loadSound("assets/audio/Megalovania.mp3");
    megalovania.jump(0);
    megalovania.play();
    megalovania.setLoop(true);    
  }
}