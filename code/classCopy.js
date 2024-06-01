/* eslint-disable no-undef */
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
// change the INPUT order of constructor
// see IMPORTANT!!!
// main attack detect teleport attack
// test if return works in attack skip
// get the attackindex = 0 from the load1all function to innit function

class ParentAttack{
  constructor(type,direction,gravity,zone,damage,cooldown,endTime){
    // innit varible COMPLETED
    this.type = type;
    this.direction = direction;
    this.gravity = gravity;
    this.zone = zone;
    this.damage = damage;
    this.cooldown = cooldown;
    this.endTime = endTime;
  }

  displayPlayer(){
    player.displayImage(this.direction);
  }
}

class StabAttack extends ParentAttack{
  constructor(direction,gravity,zone,damage,cooldown,endTime,reaction,boneTime,heightOfZone,changeTime){
    super("stab",direction,gravity,zone,damage,cooldown,endTime);
    this.type = "stab";
    this.direction = direction;
    this.gravity = gravity;
    this.zone = zone;
    this.damage = damage;
    this.cooldown = cooldown;
    this.endTime = endTime;

    this.reaction = reaction;
    this.boneTime = boneTime;
    this.height = heightOfZone;
    this.currentHeight = heightOfZone;
    this.changeTime = changeTime;
  }

  calculateDamageZone(platformEdge){
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
  
  // bone aka zone move function
  moveBone(currentMillis){
    if (currentMillis - attackInitialTime > this.reaction){
      // if the reaction period is over then have the bone come up
      // set the height to the right height and calculate zone
      if (this.currentHeight < this.height){
        // map the height into the ratio of the time between 
        // after the reaciton period and the boneTime
        // to the original height
        // eslint-disable-next-line no-extra-parens
        this.currentHeight = map(
          currentMillis - attackInitialTime - this.reaction,
          0 , this.boneTime - this.reaction,
          0, this.height);
        this.calculateDamageZone(currentPlatformEdge);
      }
    }
  }

  displayBones(currentMillis){
    // damage is built in this function other than displaying bones
    // draw the zone and determine if damage need to be taken
    if (currentMillis - attackInitialTime < this.reaction){
      // if the time elapsed in this level(currentMillis - time) is within(<) the reaction time(this.reaction)
      // then color the zone green as warning
  
      // note if it is dropping to the ground at gravity1 or gravityIndex == 0 then do not display the box at all TEMP
      if (currentGravityIndex !== 0){
        // condition met draw green zone
        rectMode(CENTER);
        fill(0,150,0);
        rect(this.zone[0],this.zone[1],this.zone[2],this.zone[3]);
      }
  
      // animation of sans throwing his hands down OPTIONAL
      // code here
  
    } else{
      // your reation time have passed
      // therefore your grace period is over and the zone is filled with white now
      rectMode(CENTER);
      fill(150,150,150);
      rect(this.zone[0],this.zone[1],this.zone[2],this.zone[3]);
        
      // take damage
      this.takeDamage(currentMillis);
  
      // bone picture: draw image of bone comming up
      // bone picture = current height
    }
  }

  movePlayer(gravity) {
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
            // attack reset the innitail time so this.reaction is accurate
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
        
        // make sure do not go over the left wall
        platformEdge = currentPlatformEdge[platformEdgeOrder.get("left")];
        if (
          player.x > platformEdge.x &&
          platformEdge.y + platformEdge.w / 2 > player.y - heart.height * scaleOfPlayer / 2 &&
          platformEdge.y - platformEdge.w / 2 < player.y + heart.height * scaleOfPlayer / 2 &&
          player.x - heart.width * scaleOfPlayer / 2 + gravity.dx < platformEdge.x + platformEdge.l / 2
        ) {
          // move = false so you stop moving throught the wall
          move = false;
          // hit the left wall set speed to 0
          gravity.dx = 0;
          player.x = platformEdge.x + platformEdge.l / 2 + heart.width * scaleOfPlayer / 2;
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
        
        // make sure do not go over the left wall
        platformEdge = currentPlatformEdge[platformEdgeOrder.get("right")];
        if (
          player.x < platformEdge.x &&
          platformEdge.y + platformEdge.w / 2 > player.y - heart.height * scaleOfPlayer / 2 &&
          platformEdge.y - platformEdge.w / 2 < player.y + heart.height * scaleOfPlayer / 2 &&
          player.x + heart.width * scaleOfPlayer / 2 + gravity.dx > platformEdge.x - platformEdge.l / 2
        ) {
          // move = false so you stop moving throught the wall
          move = false;
          // hit the left wall set speed to 0
          gravity.dx = 0;
          player.x = platformEdge.x - platformEdge.l / 2 - heart.width * scaleOfPlayer / 2;
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
} class GapAttack extends ParentAttack{
  constructor(direction,gravity,zone,damage,cooldown,endTime,reaction,boneSpeedLeft,boneSpeedRight,gapHeight,gapWidth,gapDifference){
    // innit varible COMPLETED
    super("gap",direction,gravity,zone,damage,cooldown,endTime);
    this.type = "gap";
    this.direction = direction;
    this.gravity = gravity;
    this.zone = zone;
    this.damage = damage;
    this.cooldown = cooldown;
    this.endTime = endTime;

    this.reaction = reaction;
    this.boneSpeedLeft = boneSpeedLeft;
    this.boneSpeedRight = boneSpeedRight;
    this.gapHeight = gapHeight;
    this.gapWidth = gapWidth;
    this.gapDifference = gapDifference;
  }

  // bone aka zone move function
  moveBone(currentMillis){
  }

  movePlayer(gravity) {
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
          // place the player's right at the left of the right edge
          player.x = platformEdge.x - platformEdge.l / 2 - heart.width * scaleOfPlayer / 2;
          if (keyIsDown(65)){
            // if you are pressing "a"
            // reset the gravity and go
            currentGravity[currentGravityIndex].dx = currentGravity[currentGravityIndex].dxOriginal;
            move = false;
          }
        }
        
        // make sure do not go over the left wall
        platformEdge = currentPlatformEdge[platformEdgeOrder.get("left")];
        if (
          player.x > platformEdge.x &&
          platformEdge.y + platformEdge.w / 2 > player.y - heart.height * scaleOfPlayer / 2 &&
          platformEdge.y - platformEdge.w / 2 < player.y + heart.height * scaleOfPlayer / 2 &&
          player.x - heart.width * scaleOfPlayer / 2 + gravity.dx < platformEdge.x + platformEdge.l / 2
        ) {
          // move = false so you stop moving throught the wall
          move = false;
          // hit the left wall set speed to 0
          gravity.dx = 0;
          player.x = platformEdge.x + platformEdge.l / 2 + heart.width * scaleOfPlayer / 2;
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
          // place the player's left at the right of the left edge
          player.x = platformEdge.x + platformEdge.l / 2 + heart.width * scaleOfPlayer / 2;
          if (keyIsDown(68)){
            // if you are pressing "d"
            // reset the gravity and go
            currentGravity[currentGravityIndex].dx = currentGravity[currentGravityIndex].dxOriginal;
            move = false;
          }        
        }
        
        // make sure do not go over the left wall
        platformEdge = currentPlatformEdge[platformEdgeOrder.get("right")];
        if (
          player.x < platformEdge.x &&
          platformEdge.y + platformEdge.w / 2 > player.y - heart.height * scaleOfPlayer / 2 &&
          platformEdge.y - platformEdge.w / 2 < player.y + heart.height * scaleOfPlayer / 2 &&
          player.x + heart.width * scaleOfPlayer / 2 + gravity.dx > platformEdge.x - platformEdge.l / 2
        ) {
          // move = false so you stop moving throught the wall
          move = false;
          // hit the left wall set speed to 0
          gravity.dx = 0;
          player.x = platformEdge.x - platformEdge.l / 2 - heart.width * scaleOfPlayer / 2;
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

  displayBones(currentMillis){
    rectMode(CENTER);
    fill(150,150,150);
    rect(this.zone[0][0],this.zone[0][1],this.zone[0][2],this.zone[0][3]);
    rect(this.zone[1][0],this.zone[1][1],this.zone[1][2],this.zone[1][3]);
    rect(this.zone[2][0],this.zone[2][1],this.zone[2][2],this.zone[2][3]);
    rect(this.zone[3][0],this.zone[3][1],this.zone[3][2],this.zone[3][3]);
  }

}

class TeleAttack{
  constructor(location, currentPlatformEdge){
    this.type = "teleport";
    if (location === "mid mid"){
      // // mid mid spawn
      // player.x = currentPlatformEdge[2].x;
      // player.y = currentPlatformEdge[1].y;
      this.x = currentPlatformEdge[2].x;
      this.y = currentPlatformEdge[1].y;
    }
    else if (location === "bottom mid"){
      // bottom mid spawn
      // player.x = currentPlatformEdge[platformEdgeOrder.get("down")].x;
      // // the y need to stand on top of the edge
      // player.y = currentPlatformEdge[platformEdgeOrder.get("down")].y
      // - currentPlatformEdge[platformEdgeOrder.get("down")].w / 2 
      // - heart.height * scaleOfPlayer / 2;
      this.x = currentPlatformEdge[platformEdgeOrder.get("down")].x;
      // the y need to stand on top of the edge
      this.y = currentPlatformEdge[platformEdgeOrder.get("down")].y
      - currentPlatformEdge[platformEdgeOrder.get("down")].w / 2
      - heart.height * scaleOfPlayer / 2;
    }  
  }

}

class Player{
  constructor(){
    this.x = 0;
    this.y = 0;
    this.dx = 0.005;
    this.dy = 0.005;
    this.health = 92992;
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
