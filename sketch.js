
/*
    Calculating force vectors

    Whenever a new force vector is applied to a physics object, the new vector should be added to any existing vector, so that the physics object 
    would only have one force vector at any given time.   Gravity and any accelrating forces should be calculated to get a vector that would be 
    applied to the physics object.


    Collisions 

*/

Constants = {
  Jump_Force : -130
}

class Point {
  constructor(x,y) {
    this.x =x;
    this.y =y;
  }
}


class Utilities {
  constructor(){}

  

  genUniqueID(){
    // gen a 32 char unique Alpha-numeric ID
    let uniqueID = "";

    while(uniqueID.length < 32) {

      // decide on next character Letter or Number
      let flip = Math.random() * 1;
      let nextChar = "";
      if(flip < .5) {
          // random letter
          let nextCode = Math.floor((Math.random() * 25 ) + 65);
          // console.log("Next code=" + nextCode);
          nextChar = String.fromCharCode(nextCode);
          // console.log("next CHAR=" + nextChar);

      }
      else {
          // random number 
          nextChar = Math.floor(Math.random() * 10);
          // console.log("next digit=" + nextChar);
      }
      
      uniqueID += nextChar;

    }

    return uniqueID;
    
  }
}


class PhysicsBody {

  constructor(tl, br){
    this.isStatic = false;
    this.ID = util.genUniqueID();

    this.size = {
        width : Math.abs(tl.x - br.x),
        height : Math.abs(tl.y - br.y)
    };

    this.bondingBox = {
          topLeft : tl,
          bottomRight : br
        };
    this.position = {
          x : tl.x,
          y : tl.y
        };
    this.velocity = {
          x: 0,
          y: 0
        };
    this.forces = [] // an array of force vectors being applied 
  }

  setPos(newPos) {
    this.position = newPos;
    this.bondingBox.topLeft = new Point(this.position.x, this.position.y);
    this.bondingBox.bottomRight = new Point(this.position.x + this.size.width, this.position.y + this.size.height);
    if(!this.isStatic) console.log(this);
  }

  applyForce(fvector) {
    console.log("a force has been applied to :[" + this.ID + "]" );
    this.forces.push(fvector);
  }


}


class Collision {
  constructor() {
    this.po1_id = "";
    this.po1_side = ""; // l(eft), r(ight), t(op), b(ottom)
    this.po2_id = "";
    this.po2_side = "";
  }
}

class PhysicsEngine{
  constructor() {
    this.gravity = 9.28;
    this.objectList = []
  }
  
  isInBetween(i, l, r){
    return(i >= l && i <= r);
  }

  objectsCollided(po1, po2) {
     // determine if and what side of po1 collided.  If yes, deterine which side of po2 collided

     // check left vs right
     let po2_right = po2.bondingBox.bottomRight.x;
     let po2_left = po2.position.x;
     let po2_top = po2.position.y;
     let po2_bottom = po2.bondingBox.bottomRight.y;
     
     // check for top or bottom
     if(this.isInBetween(po1.position.x, po2_left, po2_right) && this.isInBetween(po1.position.y, po2_top, po2_bottom)) {
       if(po1.position.y + po1.size.height > po2_bottom) return "bottom";
       else return "top";
     }

     // check for left or right
    if(this.isInBetween(po1.position.y, po2_top, po2_bottom)) {
      if(this.isInBetween(po1.position.x, po2_left, po2_right)) {
        if(po1.bondingBox.bottomRight.x > po2_right) return "right";
        else return "left";
      }
    }
     return "no-collision";
  }

  physicsBody(pos, size) {
    let tl = new Point(pos.x - (size.width/2), pos.y - (size.height/2));
    let br = new Point(pos.x + (size.width/2), pos.y + (size.height/2));
    let pb = new PhysicsBody(tl, br);
    this.objectList.push(pb);
    
    return pb;
  }

  forceVector(x_force,y_force) {
    return {
      x: x_force,
      y: y_force,
      accelerationY : 0,
      accelerationX : 0,
      accelerationX_start : 0,
      accelerationY_start : 0
    }
  }
  
  
  applyAccelerationToForce(f) {
    if(f.accelerationX || f.accelerationY) {
      console.log("calculating acceleration...");
      console.log("Acceleration_y=", f.accelerationY)
      if(f.accelerationX) {
        console.log("not doing x acceleration yet");
      }
      if(f.accelerationY) {
        f.y += f.accelerationY * (Date.now() - f.accelerationY_start)/10000;
      }
    }
    else {
      // decrease force over time ----
      f.x = (f.x/2);
      f.y = (f.y/2);
    }
  }


  

  calcCollisions(){

    for(let i=0; i < this.objectList.length; i++) {
      let po = this.objectList[i];
      if(po.isStatic) continue;
      for(let j=0; j < this.objectList.length; j++) {
        let po2 = this.objectList[j];
        if(po.ID == po2.ID) continue; // skip if same object
        let collision_side = this.objectsCollided(po, po2);
        if(collision_side != "no-collision")
          console.log(collision_side);
      }
      
    }
  }

  calcForces(){
    for(let i=0; i < this.objectList.length; i++) {
      let po = this.objectList[i];
      if(po.isStatic) continue;
      for(let j=0; j < po.forces.length; j++) {
        let f = po.forces[j];

        this.applyAccelerationToForce(f);
        
        po.setPos(new Point(po.position.x + f.x, po.position.y + f.y));

        // remove force if it is too small
        if( (Math.abs(f.x) < 0.01) && (Math.abs(f.y) < 0.01) ) {
          console.log("Force has depleted and will be removed");
          po.forces.splice(po.forces.indexOf(f,1));
        }
            
      }
    }
  }

}

class GameObject {
  
  constructor(_pos, _width, _height) {
    this.size = {
      width: _width,
      height: _height
    };
    
    this.color = "#f5f4f0";
    this.isVisible = true;
    this.physicsBody = Physics.physicsBody(_pos, this.size);
    this.visual = null;
    this.hasGravity = false;
  }

  applyGravity(){
    if(this.hasGravity) return;
    console.log("applying gravity to " + this.physicsBody.ID);

    let gravity =  Physics.forceVector(0, 0);
    gravity.accelerationX = 0;
    gravity.accelerationY = 9.8;
    gravity.accelerationY_start = Date.now();
    this.physicsBody.applyForce(gravity);
    this.hasGravity = true;
  }

  isOutofBounds(){
    return (this.physicsBody.bondingBox.bottomRight.y >= height);
  }


  removeAllForces(){
    console.log("removing all forces");
    this.physicsBody.forces.splice(0,this.physicsBody.forces.length);
    this.hasGravity = false;
  }

  draw() {
    if(!this.isVisible) return;
    if(this.isOutofBounds() && !this.physicsBody.isStatic) {
     // console.log("out of bounds.  resetting everything");
      this.removeAllForces();      
      this.physicsBody.setPos(new Point(this.physicsBody.position.x, height - (this.physicsBody.size.height + 1) ));
    }
    if(this.visual != null) {
      console.log("visuals are not implemented yet");
    }
    else {      
      push();
      fill(this.color);
      rect(this.physicsBody.position.x, this.physicsBody.position.y, this.size.width, this.size.height);
      pop();
    }
  }
}

 
let hero;
let Physics;
let floor;



function draw() {
  background("#15291a");
  
  // calculate
  Physics.calcForces();
  Physics.calcCollisions();

  // redraw characters
  hero.draw();
  floor.draw();
}

function keyPressed(){
  switch(keyCode) {

    case LEFT_ARROW:
      hero.physicsBody.applyForce(Physics.forceVector(-5,0));
      break;

    case RIGHT_ARROW:
      hero.physicsBody.applyForce(Physics.forceVector(5,0));
      break;

    case 32:  // space bar
      hero.applyGravity();
      hero.physicsBody.applyForce(Physics.forceVector(0,Constants.Jump_Force)); 
      
      break;

    default:
      console.log(keyCode);
  }
}

function setupFloor() {
  floor = new GameObject(new Point(0 + width/2,height), width, 10 );
  floor.color = "#fcba03";
  floor.physicsBody.isStatic = true;
}

function setup() {
  createCanvas(400, 400);
  util = new Utilities();
  Physics = new PhysicsEngine();
  hero = new GameObject(new Point(width/2,0), 10,20 );
  hero.applyGravity();
  setupFloor();

}


/* ---------------------
Movement implementation (basic)
    No physics 
    Right, Left, jump

Jump implementation :

    activated by space bar
    activated only while on ground
    object will go up for a specified distance
    No physics


    Implemented via the Game-loop







------------------------- */

