// Sans Boss fight from Undertale
// Hanson
// Date
//
// Extra for Experts:
// search bad time simulator on google and play the game so you know what I'm I trying to clone here
// I added music that would play when mouse is clicked
// I technically have 2d arrays because in the currentBones array there is a list of attacks and in each attack there is a list of gravities
// it will always fit the screen's size

class TabAttack{
  constructor(reaction,changeTime,endTime,damage,cooldown,direction,height,rectangleInfo,gravitaty){
    this.type = "tab";
    this.reaction = reaction;
    this.changeTime = changeTime;
    this.endTime = endTime;
    this.damage = damage;
    this.cooldown = cooldown;
    this.direction = direction;
    this.height = height;
    this.rectangleInfo = rectangleInfo;
    this.gravitaty = gravitaty;
  }
  calculateZone(){

  }
}

let state = "starting screen";
let level = 0;
let scaleOfPlayer;
let time;
let inttailizedAready = "no";
let damgeTime = 0;
let startMusic = false;

let platformEdgeOrder = {
  top : 0,
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

let player = {
  x: 0,
  y: 0,
  dx: 0.005,
  dy: 0.005,
  health: 92,
};

function preload() {
  // preload COMPLETED
  heart = loadImage("assets/image/heart.png");
  heartDown = loadImage("assets/image/heartDown.png");
  heartUp = loadImage("assets/image/heartUp.png");
  heartLeft = loadImage("assets/image/heartLeft.png");
  heartRight = loadImage("assets/image/heartRight.png");
  megalovania = loadSound("assets/audio/Megalovania.mp3");
}
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
  startMusic = true;
  // load level 1
  loadLevel1All();  
}
function draw() {
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
}
function drawStartScreen(){
  // draw the start screen COMPLETED
  // innitailize
  const TITLEHIEGHT = 0.25;
  const TITLEWIDTH = 0.6;
  const MODEWIDTH = 0.1;
  const MODEHEIGHT = 0.45;
  const MODEHEIGHTDIFFERENCE = 0.1;
  // display the title being: Sans Boss Fight from Undertale
  // formating
  fill("white");
  textAlign(CENTER,CENTER);
  textSize(1);
  for(let i = 0; textWidth("Sans Boss Fight from Undertale") < TITLEWIDTH * width; i++){
    textSize(i);
  }
  // display text
  text("Sans Boss Fight from Undertale", width / 2, TITLEHIEGHT * height);

  // display all the modes being: normal, endless....
  // formating
  fill("white");
  textAlign(LEFT,CENTER);
  textSize(1);
  for(let i = 1; textWidth("Normal") < MODEWIDTH * width; i++){
    textSize(i);
  }
  
  // display text of modes
  for(let modeText of modes){
    text(modeText.word, width/2, (MODEHEIGHT + MODEHEIGHTDIFFERENCE * modeText.position) * height);
  }

  // display heart at the right mode
  let heartX = 0.45;
  imageMode(CENTER);
  image(heart,
    heartX * width , (MODEHEIGHT + MODEHEIGHTDIFFERENCE * modes[mode].position) * height,
    heart.width * scaleOfPlayer,
    heart.height * scaleOfPlayer
  );
}
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
  
}
function innit(){
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
    time = millis();
    // only run it once per level
    inttailizedAready = "yes";
  }
}
function displayBones(){
  // TEMP
  let leveltime = millis();
  let attack = currentBones[currentAttackIndex];
  if (attack.type === "tab"){
    if (leveltime - time < attack.reaction){
      rectMode(CENTER);
      fill(0,150,0);
      rect(attack.rectangleInfo[0],attack.rectangleInfo[1],attack.rectangleInfo[2],attack.rectangleInfo[3]);
    }
    else{
      rectMode(CENTER);
      fill(150,150,150);
      rect(attack.rectangleInfo[0],attack.rectangleInfo[1],attack.rectangleInfo[2],attack.rectangleInfo[3]);
      if (
        player.x < attack.rectangleInfo[0] + attack.rectangleInfo[2] / 2 &&
        player.x > attack.rectangleInfo[0] - attack.rectangleInfo[2] / 2 &&
        player.y < attack.rectangleInfo[1] + attack.rectangleInfo[3] / 2 &&
        player.y > attack.rectangleInfo[1] - attack.rectangleInfo[3] / 2 &&
        damgeTime + attack.cooldown < leveltime) {
        player.health -= attack.damage;
        damgeTime = millis();
      }
    }

    if (leveltime - time > attack.changeTime){
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

    if (leveltime - time > attack.endTime){
      currentAttackIndex++;
      time = millis();
      currentGravityIndex = 0;
      currentGravity = currentBones[currentAttackIndex].gravitaty;
    }

  }
  if (attack.type === "gap"){
    if (state !== "dsfkad;lfksal;dkasdfk;slakdf;lak"){
      rectMode(CENTER);
      fill(150,150,150);
      rect(attack.rectangleInfo[0][0],attack.rectangleInfo[0][1],attack.rectangleInfo[0][2],attack.rectangleInfo[0][3]);
      rect(attack.rectangleInfo[1][0],attack.rectangleInfo[1][1],attack.rectangleInfo[1][2],attack.rectangleInfo[1][3]);
      rect(attack.rectangleInfo[2][0],attack.rectangleInfo[2][1],attack.rectangleInfo[2][2],attack.rectangleInfo[2][3]);
      rect(attack.rectangleInfo[3][0],attack.rectangleInfo[3][1],attack.rectangleInfo[3][2],attack.rectangleInfo[3][3]);
    }
    else{
      rectMode(CENTER);
      fill(150,150,150);
      rect(attack.rectangleInfo[0],attack.rectangleInfo[1],attack.rectangleInfo[2],attack.rectangleInfo[3]);
      if (
        player.x < attack.rectangleInfo[0] + attack.rectangleInfo[2] / 2 &&
        player.x > attack.rectangleInfo[0] - attack.rectangleInfo[2] / 2 &&
        player.y < attack.rectangleInfo[1] + attack.rectangleInfo[3] / 2 &&
        player.y > attack.rectangleInfo[1] - attack.rectangleInfo[3] / 2 &&
        damgeTime + attack.cooldown < leveltime) {
        player.health -= attack.damage;
        damgeTime = millis();
      }
    }

    if (leveltime - time > attack.changeTime){
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

    if (leveltime - time > attack.endTime){
      currentAttackIndex++;
      time = millis();
      currentGravityIndex = 0;
      currentGravity = currentBones[currentAttackIndex].gravitaty;
    }

  }
}
function displayPlatformEdge(){
  // given the currentPlatformEdge display each of them COMPLETED
  for (let platformEdge of currentPlatformEdge){
    rectMode(CENTER);
    fill("white");
    noStroke();
    rect(platformEdge.x, platformEdge.y, platformEdge.l, platformEdge.w);
  }
}
function movePlayer() {
  // TEMP
  if (currentBones[currentAttackIndex].type === "next round"){
    // temppppppppp
    player.x = actions[action].positionX;
    player.y = actions[action].positionY;
  }
  else{
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
}
function displayPlayer(){
  // TEMP
  if (currentBones[currentAttackIndex].type === "next round"){
    image(heart, player.x, player.y, heart.width * scaleOfPlayer, heart.height * scaleOfPlayer);
  }
  else{
    let attack = currentBones[currentAttackIndex];
    let gravitaty = currentGravity[currentGravityIndex];
    if (gravitaty.mode === "off"){
      image(heart, player.x, player.y, heart.width * scaleOfPlayer, heart.height * scaleOfPlayer);
    }
    else{
      if (attack.direction === "down"){
        image(heartDown, player.x, player.y, heart.width * scaleOfPlayer, heart.height * scaleOfPlayer);
      }
      if (attack.direction === "up"){
        image(heartUp, player.x, player.y, heart.width * scaleOfPlayer, heart.height * scaleOfPlayer);
      }
      if (attack.direction === "left"){
        image(heartLeft, player.x, player.y, heart.width * scaleOfPlayer, heart.height * scaleOfPlayer);
      }
      if (attack.direction === "right"){
        image(heartRight, player.x, player.y, heart.width * scaleOfPlayer, heart.height * scaleOfPlayer);
      }
    }
  }
}
function takeAction(){
  if (level === 1){
    loadLevel1All();
  }
  if (level === 2){
    loadLevel2All();
  }
}
function loadLevel1All(){
  // level 1
  // platformEdge
  let platformEdge1={x: 0.5 * height,y: 0.5 * height,l: 0.26 * height,w: 0.01 * height};
  let platformEdge2={x: 0.375 * height,y: 0.625 * height,l: 0.01 * height,w: 0.26 * height};
  let platformEdge3={x: 0.5 * height,y: 0.75 * height,l: 0.26 * height,w: 0.01 * height};
  let platformEdge4={x: 0.625 * height,y: 0.625 * height,l: 0.01 * height,w: 0.26 * height};
  // let platformEdge1={x: 0.5,y: 0,l: 1,w: 0.025}; top
  // let platformEdge2={x: 0,y: 0.5,l: 0.025,w: 1}; left
  // let platformEdge3={x: 0.5,y: 1,l: 1,w: 0.025}; down
  // let platformEdge4={x: 1,y: 0.5,l: 0.025,w: 1}; right
  let level1PlatformEdge = [platformEdge1,platformEdge2,platformEdge3,platformEdge4];
  currentPlatformEdge = level1PlatformEdge;

  // bones
  // attack 1
  // gravity
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

  let attack1 = {
    type: "tab",
    reaction: 1000,
    changeTime: 1200,
    endTime: 3000,
    damage: 7,
    cooldown: 400,
    direction: "down",
    height: 0.08,
    rectangleInfo: [],
    gravitaty: structuredClone(currentGravity)
  };

  attack1.height = attack1.height * height;
  attack1.rectangleInfo = [
    level1PlatformEdge[platformEdgeOrder.down].x,
    level1PlatformEdge[platformEdgeOrder.down].y - level1PlatformEdge[platformEdgeOrder.down].w / 2 - attack1.height / 2,
    level1PlatformEdge[platformEdgeOrder.down].l - level1PlatformEdge[platformEdgeOrder.left].l - level1PlatformEdge[platformEdgeOrder.right].l,
    attack1.height
  ];
  currentAttackIndex = 0;
  currentBones = [attack1];
  
  // attack 2

  for (let i = 0; i < 6; i++){

    // random attack
    let randomNumber = floor(random(4));
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

    let attack2 = {
      type: "tab",
      reaction: 700,
      changeTime: 1000,
      endTime: 1300,
      damage: 3,
      cooldown: 150,
      direction: directions[randomNumber],
      height: 0.02,
      rectangleInfo: [],
      gravitaty: structuredClone(currentGravity),
    };

    attack2.height = attack2.height * height;
    if (attack2.direction === "up"){
      attack2.rectangleInfo = [
        level1PlatformEdge[platformEdgeOrder.top].x,
        level1PlatformEdge[platformEdgeOrder.top].y + level1PlatformEdge[platformEdgeOrder.down].w / 2 + attack2.height / 2,
        level1PlatformEdge[platformEdgeOrder.top].l - level1PlatformEdge[platformEdgeOrder.left].l - level1PlatformEdge[platformEdgeOrder.right].l,
        attack2.height
      ];
    }
    if (attack2.direction === "down"){
      attack2.rectangleInfo = [
        level1PlatformEdge[platformEdgeOrder.down].x,
        level1PlatformEdge[platformEdgeOrder.down].y - level1PlatformEdge[platformEdgeOrder.down].w / 2 - attack2.height / 2,
        level1PlatformEdge[platformEdgeOrder.down].l - level1PlatformEdge[platformEdgeOrder.left].l - level1PlatformEdge[platformEdgeOrder.right].l,
        attack2.height
      ];
    }
    if (attack2.direction === "left"){
      attack2.rectangleInfo = [
        level1PlatformEdge[platformEdgeOrder.left].x + level1PlatformEdge[platformEdgeOrder.left].l / 2 + attack2.height / 2,
        level1PlatformEdge[platformEdgeOrder.left].y,
        attack2.height,
        level1PlatformEdge[platformEdgeOrder.left].w - level1PlatformEdge[platformEdgeOrder.top].w - level1PlatformEdge[platformEdgeOrder.down].w
      ];
    }
    if (attack2.direction === "right"){
      attack2.rectangleInfo = [
        level1PlatformEdge[platformEdgeOrder.right].x - level1PlatformEdge[platformEdgeOrder.right].l / 2 - attack2.height / 2,
        level1PlatformEdge[platformEdgeOrder.right].y,
        attack2.height,
        level1PlatformEdge[platformEdgeOrder.right].w - level1PlatformEdge[platformEdgeOrder.top].w - level1PlatformEdge[platformEdgeOrder.down].w
      ];
    }
    currentBones.push(attack2);
  }

  // attack last
  let attackLast = {type: "next round"};
  currentBones.push(attackLast);

  currentGravity = [gravitaty1,gravitaty2,gravitaty3];
  
}
function loadLevel2All(){
  // level 2
  // platformEdge
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

  // bones
  // attack 1
  // gravity
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

  let attack1 = {
    type: "tab",
    reaction: 1000,
    changeTime: 1200,
    endTime: 3000,
    damage: 7,
    cooldown: 400,
    direction: "down",
    height: 0.08,
    rectangleInfo: [],
    gravitaty: structuredClone(currentGravity)
  };

  attack1.height = attack1.height * height;
  attack1.rectangleInfo = [
    level2PlatformEdge[platformEdgeOrder.down].x,
    level2PlatformEdge[platformEdgeOrder.down].y - level2PlatformEdge[platformEdgeOrder.down].w / 2 - attack1.height / 2,
    level2PlatformEdge[platformEdgeOrder.down].l - level2PlatformEdge[platformEdgeOrder.left].l - level2PlatformEdge[platformEdgeOrder.right].l,
    attack1.height
  ];
  currentAttackIndex = 0;
  currentBones = [attack1];
  
  // attack 2

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
      rectangleInfo: [],
      gravitaty: structuredClone(currentGravity),
    };

    attack2.gapHeight = attack2.gapHeight * (level2PlatformEdge[platformEdgeOrder.left].w - level2PlatformEdge[platformEdgeOrder.down].w - level2PlatformEdge[platformEdgeOrder.top].w);
    attack2.gapDifference = attack2.gapDifference * (level2PlatformEdge[platformEdgeOrder.left].w - level2PlatformEdge[platformEdgeOrder.down].w - level2PlatformEdge[platformEdgeOrder.top].w);
    attack2.gapWidth = attack2.gapWidth * (level2PlatformEdge[platformEdgeOrder.down].l - level2PlatformEdge[platformEdgeOrder.left].l - level2PlatformEdge[platformEdgeOrder.right].l);
    if (attack2.direction === "down"){
      attack2.rectangleInfo = [
        [
          level2PlatformEdge[platformEdgeOrder.left].x - 0,
          level2PlatformEdge[platformEdgeOrder.top].y + level2PlatformEdge[platformEdgeOrder.top].w / 2 + level2PlatformEdge[platformEdgeOrder.left].w / 2 - level2PlatformEdge[platformEdgeOrder.down].w / 2 - level2PlatformEdge[platformEdgeOrder.top].w / 2 - attack2.gapHeight / 2 - attack2.gapDifference / 2,
          attack2.gapWidth,
          level2PlatformEdge[platformEdgeOrder.top].w / 2 + (level2PlatformEdge[platformEdgeOrder.left].w - level2PlatformEdge[platformEdgeOrder.down].w - level2PlatformEdge[platformEdgeOrder.top].w) - attack2.gapHeight - attack2.gapDifference
        ],
        [
          level2PlatformEdge[platformEdgeOrder.left].x - 0,
          level2PlatformEdge[platformEdgeOrder.down].y - level2PlatformEdge[platformEdgeOrder.down].w / 2 - attack2.gapHeight / 2,
          attack2.gapWidth,
          attack2.gapHeight
        ],
        [
          level2PlatformEdge[platformEdgeOrder.right].x - 0,
          level2PlatformEdge[platformEdgeOrder.top].y + level2PlatformEdge[platformEdgeOrder.top].w / 2 + level2PlatformEdge[platformEdgeOrder.left].w / 2 - level2PlatformEdge[platformEdgeOrder.down].w / 2 - level2PlatformEdge[platformEdgeOrder.top].w / 2 - attack2.gapHeight / 2 - attack2.gapDifference / 2,
          attack2.gapWidth,
          level2PlatformEdge[platformEdgeOrder.top].w / 2 + (level2PlatformEdge[platformEdgeOrder.left].w - level2PlatformEdge[platformEdgeOrder.down].w - level2PlatformEdge[platformEdgeOrder.top].w) - attack2.gapHeight - attack2.gapDifference
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
      attack2.rectangleInfo = [
        [
          level2PlatformEdge[platformEdgeOrder.left].x - 0,
          level2PlatformEdge[platformEdgeOrder.down].y - level2PlatformEdge[platformEdgeOrder.down].w / 2 - attack2.gapHeight / 2,
          attack2.gapWidth,
          attack2.gapHeight
        ],
        [
          level2PlatformEdge[platformEdgeOrder.left].x - 0,
          level2PlatformEdge[platformEdgeOrder.top].y + level2PlatformEdge[platformEdgeOrder.top].w / 2 + (level2PlatformEdge[platformEdgeOrder.left].w - level2PlatformEdge[platformEdgeOrder.down].w - level2PlatformEdge[platformEdgeOrder.top].w) - attack2.gapHeight - attack2.gapDifference,
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
    //   attack2.rectangleInfo = [
    //     level2PlatformEdge[platformEdgeOrder.left].x + level2PlatformEdge[platformEdgeOrder.left].l / 2 + attack2.height / 2,
    //     level2PlatformEdge[platformEdgeOrder.left].y,
    //     attack2.height,
    //     level2PlatformEdge[platformEdgeOrder.left].w - level2PlatformEdge[platformEdgeOrder.top].w - level2PlatformEdge[platformEdgeOrder.down].w
    //   ];
    // }
    // if (attack2.direction === "right"){
    //   attack2.rectangleInfo = [
    //     level2PlatformEdge[platformEdgeOrder.right].x - level2PlatformEdge[platformEdgeOrder.right].l / 2 - attack2.height / 2,
    //     level2PlatformEdge[platformEdgeOrder.right].y,
    //     attack2.height,
    //     level2PlatformEdge[platformEdgeOrder.right].w - level2PlatformEdge[platformEdgeOrder.top].w - level2PlatformEdge[platformEdgeOrder.down].w
    //   ];
    // }
    currentBones.push(attack2);
  }

  // attack last
  let attackLast = {type: "next round"};
  currentBones.push(attackLast);

  currentGravity = [gravitaty1,gravitaty2,gravitaty3];
  
}
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
}
function stopLeft(){
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
}
function stopUp(){
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
}
function stopDown(){
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
function mouseReleased(){
  if (startMusic){
    megalovania.jump(0);
    megalovania.play();
    megalovania.setLoop(true);
  }
}