
let PlaidMaxAge =4000;  // expressed in milliseconds

let plaidList = [];  // contains every plaid in the game/simulation

let plaidLinesColor = "white";
let plaidLinesThickness = "1";

class Plaid {

    constructor(){
        this.tob = Date.now();
        this.speed = 1;
    }

    makeBaby() {
        this.tob = Date.now() +  Math.random() * 100;
        this.speed = Math.ceil(Math.random() * 2);
    }
}




function calcPlaidSize(plaidAge, pSpeed){
    let size = (plaidAge/PlaidMaxAge) * height;
        size *= pSpeed;
    if (size >= height ) return height;    
    else return size;
}





function drawHline(ypos){
    let p1 = {x: 0, y:ypos};
    let p2 = {x: width, y:ypos};

    line(p1.x, p1.y, p2.x, p2.y); 
}

function drawVline(xpos){
    let p1 = {x: xpos, y:0};
    let p2 = {x: xpos, y:height};

  
    line(p1.x, p1.y, p2.x, p2.y);
}

function calcPlaidAge(tob) {
    return Date.now() - tob ;
}



function drawPlaid(size) {
    // a plaid is made of two v lines and two h lines.
    // the lines form an ever-expanding square
    

    stroke(plaidLinesColor);   // <---  this is the color command
    strokeWeight(plaidLinesThickness);

    drawVline(width/2 + size);
    drawVline(width/2 - size);

    drawHline(height/2 + size);
    drawHline(height/2 - size);
}


function correctPlaidSize(p) {
    let plaidAge = calcPlaidAge(p.tob);
    let plaidSize = calcPlaidSize(plaidAge,p.speed);
   
    if( (plaidSize >= height/2) || (plaidAge >= PlaidMaxAge) )
       p.makeBaby();


       
    // else
       //console.log(plaidSize); 
}


function setLineThickness(p) {
   // plaidLinesThickness = (calcPlaidSize(calcPlaidAge(p.tob),p.speed) /width) * 50;
}

 function draw() {
    background("#15291a");
    
    plaidList.forEach(p => {
       // console.log(p);
       
       setLineThickness(p);

        let age = calcPlaidAge(p.tob);
        drawPlaid(calcPlaidSize(age, p.speed));
        correctPlaidSize(p);
    });
}
  

 
  
  function setup() {
    createCanvas(400, 400); 


    for(var i=0; i < 90; i++) {
        let p = new Plaid();
        plaidList.push(p);
        // console.log(p);
    } 
  
  }
  


