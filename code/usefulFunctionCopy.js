/* eslint-disable no-undef */

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

// music

function preloadWithPromise() {
  let promise = new Promise(
    function (resolve, reject) {
      if (canLoad){
        megalovania = loadSound("assets/audio/Megalovania.mp3", ()=>{
          resolve();
        });
      }
      else{
        reject();
      }
    });
  return promise;
}

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
      scaleOfPlayer = 0.000045 * height;
      state = modes[mode].word;
      level++;
      innit();
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
      state = modes[mode].word;
      level++;
      innit();
    }
    action += modes.length;
    action = action % actions.length;
  }
  
}

function mainAttack(){
  //initailize COMPLETED
  let currentMillis = millis();
  let attack = currentBones[currentBonesIndex];
  let gravity = currentGravity[currentGravityIndex];

  // Change gravity to the right mode depending on the timming of attack.changeTime
  if (attack.type === "stab"){
    if (currentMillis - attackInitialTime > attack.changeTime){
      // changeTime means gravity is off
      attack.direction = "heart";
      currentGravityIndex = 2;
      gravity = currentGravity[currentGravityIndex];
    } 
  }

  // When the attack ends COMPLETED
  if (currentMillis - attackInitialTime >= attack.endTime){
    // if the time in the attack excessed the end time then end it by moving to the next attack    

    // increase attack index and
    // reset everything else
    attackInitialTime = currentMillis;

    currentBonesIndex++;
    attack = currentBones[currentBonesIndex];

    // when the level ends COMPLETED
    // check if the attack type is next level then it is the last atack thus advance level COMPLETED
    if (attack.type === "next level"){
      state = "action time";
      return "don't again";
    }

    // when the level ends COMPLETED
    // teleport if attack.type = teleport
    if (attack.type === "teleport"){
      player.x = attack.x;
      player.y = attack.y;
      currentBonesIndex++;
      currentGravityIndex = 0;
      currentGravity = currentBones[currentBonesIndex].gravity;
      return "try again";
    }
    
    // reset gravity or keep gravity
    
    let currentGravityTemp = attack.gravity[0];
    if (currentGravityTemp.mode !== "previous"){
      //print(attack, attack.gravity, currentGravityTemp, currentGravityTemp.mode, (attack.gravity).mode !== "previous")
      currentGravityIndex = 0;
      currentGravity = attack.gravity;
      gravity = currentGravity[currentGravityIndex];
    }

    return "don't again";
  }

  // move player TEMP
  attack.moveBone(currentMillis);
  attack.movePlayer(gravity);
  // display bones, player, action boxes, platform edge COMPLETED
  attack.displayBones(currentMillis);
  attack.displayPlayer();

  // a way to track the player DEBUG
  // line(player.x, 0, player.x, height);
  // line(0, player.y, width, player.y);
  // circle(player.x, player.y, heart.width * scaleOfPlayer)

  return "don't again";
}



// display functions
function displayPlatformEdge(){
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
}



// load levels
function innit(){
  // innitialize the starting x,y position of the heart // reset timer // only run it once per level COMPLETED

  // innitail spawn
  if(level === 1){
    // load attack
    loadLevel1All();

    // // mid mid spawn
    // player.x = currentPlatformEdge[2].x;
    // player.y = currentPlatformEdge[1].y;
  }
  if(level === 2){
    // load attack
    loadLevel2All();

    // // bottom mid spawn
    // player.x = currentPlatformEdge[platformEdgeOrder.get("down")].x;
    // // the y need to stand on top of the edge
    // player.y = currentPlatformEdge[platformEdgeOrder.get("down")].y
    // - currentPlatformEdge[platformEdgeOrder.get("down")].w / 2 
    // - heart.height * scaleOfPlayer / 2;
  }
  // reset timer
  attackInitialTime = millis();

  currentBonesIndex = 0;
  attack = currentBones[currentBonesIndex];

  // when the level ends COMPLETED
  // check if the attack type is next level then it is the last atack thus advance level COMPLETED
  if (attack.type === "next level"){
    state = "action time";
    return "don't again";
  }

  // when the level ends COMPLETED
  // teleport if attack.type = teleport
  if (attack.type === "teleport"){
    player.x = attack.x;
    player.y = attack.y;
    currentBonesIndex++;
    return "try again";
  }
    
} function loadLevel2All(){
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

  // first Teteloport
  let teleAttack1 = new TeleAttack("mid mid", level1PlatformEdge);
  currentBones = [teleAttack1];

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
  let attack1 = new StabAttack("down", structuredClone(currentGravity), [], 7, 80, 3000, 1000, 1150, 0.08 * height, 1200);
  
  // attack1.type = "stab";
  // attack1.reaction = 1000;
  // attack1.changeTime = 1200;
  // attack1.endTime = 3000;
  // attack1.damage = 7;
  // attack1.cooldown = 400;
  // attack1.direction = "down";
  // attack1.height = 0.08 * height;
  // // attack1.currentHeight = 0.08 * height;
  // attack1.zone = [];
  // attack1.gravity = structuredClone(currentGravity);
  // attack1.boneTime = 1500

  // calculated damge zone for the green box at full height COMPLETED
  attack1.calculateDamageZone(level1PlatformEdge);

  // set the height back to 0 because it start at zero to rise
  attack1.currentHeight = 0;
  
  // push the attack in COMPLETED
  currentBones.push(attack1);

  // tele
  let teleAttack2 = new TeleAttack("mid mid", level1PlatformEdge);
  currentBones.push(teleAttack2);
  
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

    let attack2 = new StabAttack(directions[randomNumber], structuredClone(currentGravity), [], 3, 30, 1000, 600, 800, 0.02 * height, 1000);
    // attack2.type = "stab";
    // attack2.reaction = 600;
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
    // set the height back to 0 because it start at zero to rise
    attack2.currentHeight = 0;

    // push the attack in COMPLETED
    currentBones.push(attack2);
  }

  // attack last or attack 3
  let attackLast = {type: "next level"};
  currentBones.push(attackLast);

  currentGravity = [gravity1,gravity2,gravity3];
  
} function loadLevel1All(){
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

  let teleAttack1 = new TeleAttack("mid mid", level2PlatformEdge);
  currentBones = [teleAttack1];

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
  let attack1 = new StabAttack("down", structuredClone(currentGravity), [], 7, 80, 3000, 1000, 1150, 0.08 * height, 1200);

  // attack1.type = "stab";
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
  // set the height back to 0 because it start at zero to rise
  attack1.currentHeight = 0;

  // push the attack in COMPLETED
  currentBones.push(attack1);
  

  // tele
  let teleAttack2 = new TeleAttack("bottom mid", level2PlatformEdge);
  currentBones.push(teleAttack2);


  // attack Innit 2

  // IMPORTANT!!!

  // set the right gravity

  // attack 2 TEMP
  for (let i = 0; i < 11; i++){

    let direction = "down";

    // gravity
    if (direction === "down"){
      let gravity5 = {
        mode: "previous",
        accerlerationX: 0,
        dx: 0,
        accerlerationY: 0.1 / 662 * height,
        dy: -3.5 / 662 * height,
        dyOriginal: -3.5 / 662 * height,
      };

      currentGravityIndex = 0;
      currentGravity = [gravity5];
    }

    let attack2 = new GapAttack("down",structuredClone(currentGravity),[],3,10,2300,700,2,-2,0.15,0.04,0.12);
    // attack.type = "gap";
    // attack.reaction = 700;
    // attack.boneSpeedLeft = 1000;
    // attack.boneSpeedRight = 1000;
    // attack.endTime = 2300;
    // attack.gapHeight = 0.15;
    // attack.gapWidth = 0.04;
    // attack.gapDifference = 0.12;
    // attack.damage = 3;
    // attack.cooldown = 50;
    // attack.direction = "down";
    // attack.zone = [];
    // attack.gravity = structuredClone(currentGravity);

    attack2.calculateDamageZone(level2PlatformEdge);
    currentBones.push(attack2);
  }

  // attack last
  let attackLast = {type: "next level"};
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