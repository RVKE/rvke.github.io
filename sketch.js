let simulationStarted = false;
let bodies = [];
let placeMode = false;
let slingshotMode = false;
let slingshotPos;
let currentBody;
let pixelKmRatio = 1000; //ratio 1 pixel to 1 km
let physicsEnabled = true;
let velocityLinesEnabled = false;
let vectorLinesEnabled = false;
let backgroundImage;
const gravitationalConstant = 6.674*(10**-11);

function start() {
  simulationStarted = true;
  createCanvas(windowWidth, windowHeight);
  noStroke();

  placeButton("PLACE STELLAR BODY", 10, 60, 20, openMenu);
  placeButton("+", 10, 10, 10, function() { changeScale(0.5);});
  placeButton("-", 35, 10, 10, function() { changeScale(2);});
  placeButton("Toggle Physics", 65, 10, 10, togglePhysics);
  placeButton("Remove Bodies", 160, 10, 10, removeBodies);
  placeButton("Toggle velocity lines", 10, 35, 10, toggleVelocityLines);
  placeButton("Toggle vector lines", 150, 35, 10, toggleVectorLines);

  //placeBody("Earth", windowWidth/2, windowHeight/2, 0, 0, 5.972*(10**24), 12742, color('#6580C1'));
  //placeBody("Moon", (windowWidth/2)-(3.844*(10**5)/pixelKmRatio), windowHeight/2, 0, -1, 7.347*(10**22), 3474, color('#CCC1BF'));

  //placeBody("The Sun", (windowWidth/2), (windowHeight/2), 0, 0, 1.989*(10**30), 1392700, color('#FEBF76'));
  //placeBody("Mercury", (windowWidth/2)-(5.8*(10**6)/pixelKmRatio), (windowHeight/2), 0, -150, 3.285*(10**23), 4879, color('#797979'));
  //placeBody("Earth", (windowWidth/2)-(1.496*(10**8)/pixelKmRatio), (windowHeight/2), 0, -30, 5.972*(10**24), 12742, color('#6580C1'));
  //placeBody("Moon", (windowWidth/2)-((1.496*(10**8)-(3.844)*(10**5))/pixelKmRatio), (windowHeight/2), 0, -31, 7.347*(10**22), 3474, color('#CCC1BF'));
  //placeBody("Jupiter", (windowWidth/2)-(7.785*(10**8)/pixelKmRatio), (windowHeight/2), 0, -31, 1.898*(10**27), 139820, color('#F6D3BC'));

  for (i = 0; i < bodies.length; i++) {
    bodies[i].pos.add(p5.Vector.sub(createVector(mouseX, mouseY), createVector(windowWidth/2, windowHeight/2)));
  }

  setBackgroundImage();

}

function setBackgroundImage() {
  backgroundImage = createImage(windowWidth, windowHeight);;

  for (let x = 0; x < backgroundImage.width; x++) {
    for (let y = 0; y < backgroundImage.height; y++) {
      backgroundImage.set(x, y, noise(x/150, y/150)*random(10, 30));
    }
  }

  for (let j = 0; j < 400; j++) {
    backgroundImage.set(random(backgroundImage.width), random(backgroundImage.height), random(100, 255));
  }
  backgroundImage.updatePixels();
}

function placeButton(text, x, y, size, action) {
  button = createButton(text);
  button.position(x, y);
  button.style('font-size', size + "px")
  button.mousePressed(action);
}

function openMenu() {
  placeButton("SAGITTARIUS A *", 10, 100, 15, function() { setBody("Sagittarius a *");});
  placeButton("THE SUN", 10, 130, 15, function() { setBody("The Sun");});
  placeButton("EARTH", 10, 160, 15, function() { setBody("Earth");});
  placeButton("MOON", 10, 190, 15, function() { setBody("Moon");});
  placeButton("MERCURY", 10, 220, 15, function() { setBody("Mercury");});
  placeButton("JUPITER", 10, 250, 15, function() { setBody("Jupiter");});
  placeButton("URANUS", 10, 280, 15, function() { setBody("Uranus");});
  placeButton("TON 618", 10, 310, 15, function() { setBody("TON 618");});
  placeButton("VY CANIS MAJORIS", 10, 340, 15, function() { setBody("VY Canis Majoris");});
  placeButton("PROXIMA CENTAURI", 10, 370, 15, function() { setBody("Proxima Centauri");});
}

function togglePhysics() {
  physicsEnabled = !physicsEnabled
}

function removeBodies() {
  bodies = [];
}

function toggleVelocityLines() {
  velocityLinesEnabled = !velocityLinesEnabled;
}

function toggleVectorLines() {
  vectorLinesEnabled = !vectorLinesEnabled;
}

function playSound(audio) {
  let newSound = new Audio(audio);
  newSound.play()
}

function changeScale(scaleMultiplier) {
  pixelKmRatio *= scaleMultiplier;
  playSound("SOUND/zoom.mp3");
  for (i = 0; i < bodies.length; i++) {
    bodies[i].pos.div(scaleMultiplier);
    if (scaleMultiplier > 1) {
      bodies[i].pos.add(createVector(windowWidth/4, windowHeight/4));
    } else {
      bodies[i].pos.sub(createVector(windowWidth/2, windowHeight/2));
    }
  }
}

function setBody(currentBodyName) {
  placeMode = !placeMode;
  currentBody = currentBodyName;
  playSound("SOUND/select.mp3");
}

function placeBody(name, x, y, vx, vy, m, d, c) {
  newBody = new Body(name, x, y, vx, vy, m, d, c);
  bodies.push(newBody);
  placeMode = false;
}

function mouseClicked() {
  if (slingshotMode == false) {
    if (mouseX > 250 || mouseY > 400) {
      if (placeMode == true) {
        slingshotPos = createVector(mouseX, mouseY);
        slingshotMode = true;
      } else {
        for (i = 0; i < bodies.length; i++) {
          bodies[i].pos.add(p5.Vector.sub(createVector(windowWidth/2, windowHeight/2), createVector(mouseX, mouseY)));
        }
      }
    }
  } else {

    let speedVector = p5.Vector.mult(p5.Vector.div(p5.Vector.sub(slingshotPos, createVector(mouseX, mouseY)), 60), pixelKmRatio/1000);
    playSound("SOUND/place.mp3");
    if (currentBody == "Sagittarius a *") {
      placeBody(currentBody, slingshotPos.x, slingshotPos.y, speedVector.x, speedVector.y, 8.550*(10**36), 22000000, color('#000000'));
    } else if (currentBody == "The Sun") {
      placeBody(currentBody, slingshotPos.x, slingshotPos.y, speedVector.x, speedVector.y, 1.989*(10**30), 1392700, color('#FEBF76'));
    } else if (currentBody == "Earth") {
      placeBody(currentBody, slingshotPos.x, slingshotPos.y, speedVector.x, speedVector.y, 5.972*(10**24), 12742, color('#6580C1'));
    } else if (currentBody == "Moon") {
      placeBody(currentBody, slingshotPos.x, slingshotPos.y, speedVector.x, speedVector.y, 7.347*(10**22), 3474, color('#CCC1BF'));
    } else if (currentBody == "Mercury") {
      placeBody(currentBody, slingshotPos.x, slingshotPos.y, speedVector.x, speedVector.y, 3.285*(10**23), 4879, color('#797979'));
    } else if (currentBody == "Jupiter") {
      placeBody(currentBody, slingshotPos.x, slingshotPos.y, speedVector.x, speedVector.y, 1.898*(10**27), 139820, color('#F6D3BC'));
    } else if (currentBody == "Uranus") {
      placeBody(currentBody, slingshotPos.x, slingshotPos.y, speedVector.x, speedVector.y, 8.681*(10**25), 50724, color('#AACDD5'));
    } else if (currentBody == "TON 618") {
      placeBody(currentBody, slingshotPos.x, slingshotPos.y, speedVector.x, speedVector.y, 1.312*(10**41), 3784000000000, color('#000000'));
    } else if (currentBody == "VY Canis Majoris") {
      placeBody(currentBody, slingshotPos.x, slingshotPos.y, speedVector.x, speedVector.y, 3.381*(10**31), 1975780000, color('#FD5901'));
    } else if (currentBody == "Proxima Centauri") {
      placeBody(currentBody, slingshotPos.x, slingshotPos.y, speedVector.x, speedVector.y, 2.446*(10**29), 214550, color('#A7CFF7'));
    }
    slingshotMode = false;
  }
}

function draw () {
  if (simulationStarted != true) {
    return;
  }

  background(0);
  image(backgroundImage, 0, 0);

  if (slingshotMode == true) {
    fill(255);
    text("SLINGSHOT MODE", 500, 50);
    fill(255, 255, 255, 60)
    ellipse(slingshotPos.x, slingshotPos.y, 10);
    stroke(255, 255, 0, 170);
    line(slingshotPos.x, slingshotPos.y, mouseX, mouseY);
    noStroke();

    stroke(0, 255, 0, 170);
    line(slingshotPos.x, 0, slingshotPos.x, windowHeight);
    line(0, slingshotPos.y, windowWidth, slingshotPos.y);
    noStroke();
  }

  for (i = 0; i < bodies.length; i++) {
    if (keyIsDown(65)) {
      bodies[i].pos.add(createVector(10, 0));
    }
    if (keyIsDown(68)) {
      bodies[i].pos.add(createVector(-10, 0));
    }
    if (keyIsDown(87)) {
      bodies[i].pos.add(createVector(0, 10));
    }
    if (keyIsDown(83)) {
      bodies[i].pos.add(createVector(0, -10));
    }
    bodies[i].display();
    if (physicsEnabled == true) {
      bodies[i].calculatePos();
    }
  }

  if (placeMode == true && slingshotMode == false) {
    stroke(0, 255, 0, 170);
    line(mouseX, 0, mouseX, windowHeight);
    line(0, mouseY, windowWidth, mouseY);
    noStroke();
    fill(255);
    text("Placing: " + currentBody, mouseX+10, mouseY-10);
  }

  //TIJDELIJK:
  stroke(0, 255, 0, 170);
  line(20, windowHeight-40, 20+(100/pixelKmRatio), windowHeight-40);
  noStroke();
  stroke(255, 0, 255, 170);
  line(20, windowHeight-30, 20+((3.844*(10**5))/pixelKmRatio), windowHeight-30);
  noStroke();
  stroke(0, 255, 255, 170);
  line(20, windowHeight-20, 20+((1.496*(10**8))/pixelKmRatio), windowHeight-20);
  noStroke();
  stroke(255, 255, 0, 170);
  line(20, windowHeight-10, 20+((9.461*(10**12))/pixelKmRatio), windowHeight-10);
  noStroke();
  fill(255);
  text(round(frameRate()) + " fps", 280, 30);
  text(bodies.length + " bodies", 280, 50);
  text("physicsEnabled = " + physicsEnabled, 280, 70);
  text("1 Pixel = " + round(pixelKmRatio * 100)/100 + "km", 280, 90);
  stroke(255, 255, 255, 255);
  line((windowWidth/2)-5, windowHeight/2, (windowWidth/2)+5, windowHeight/2);
  line(windowWidth/2, (windowHeight/2)-5, windowWidth/2, (windowHeight/2)+5);
  noStroke();

}

function windowResized() {
   resizeCanvas(windowWidth, windowHeight);
   background(0);
   image(backgroundImage, 0, 0);
}

class Body {
  constructor(name, x, y, vx, vy, m, d, c) {
    this.name = name; // + round(random(1000)
    this.pos = createVector(x, y); // km
    this.vel = createVector(vx, vy); // k/h
    this.mass = m; // kg
    this.diameter = d; // km
    this.color = c;
    this.acc = createVector(0, 0); // m/s^2 ????
    this.force = createVector(0, 0); // N
    this.forces = [];
  }

  calculatePos() {
    let combinedForces = createVector(0, 0);
    for (let f = 0; f < this.forces.length; f++) {
      combinedForces.add(this.forces[f]);
    }

    this.force = combinedForces;
    this.acc = (p5.Vector.div(this.force, this.mass));
    this.vel.add(p5.Vector.div(this.acc, 1)); //12960
    this.pos.add(p5.Vector.div(this.vel, pixelKmRatio/1000));

    if (velocityLinesEnabled == true) {
      stroke(100, 100, 255, 255);
      line(this.pos.x, this.pos.y, this.pos.x+(this.vel.x*60/pixelKmRatio*1000), this.pos.y+(this.vel.y*60/pixelKmRatio*1000));
      noStroke();
    }

    if (bodies.length >= 2) {
      for (let t = 0; t < bodies.length; t++) {
        if (this != bodies[t]) {
          if (p5.Vector.dist(bodies[t].pos, this.pos) > ((this.diameter/pixelKmRatio)/2) + ((bodies[t].diameter/pixelKmRatio)/2)) {
            let distance = p5.Vector.dist(bodies[t].pos, this.pos) * pixelKmRatio * 1000; // m
            let gravitionalForce = ((gravitationalConstant * this.mass * bodies[t].mass) / sq(distance));

            let vectorb = p5.Vector.sub(this.pos, bodies[t].pos);
            let unitDir = createVector(-vectorb.x/sqrt(sq(vectorb.x)+sq(vectorb.y)), -vectorb.y/sqrt(sq(vectorb.x)+sq(vectorb.y)));

            let newForce = unitDir.mult(gravitionalForce);

            this.forces[t] = newForce;

            if (vectorLinesEnabled == true) {
              stroke(255, 100, 0, 255);
              line(this.pos.x, this.pos.y, bodies[t].pos.x, bodies[t].pos.y);
              noStroke();
            }

          } else {
            if (this.mass > bodies[t].mass) {
              let newName = this.name + bodies[t].name.toLowerCase();
              let newPos = createVector(this.pos.x, this.pos.y);
              let combinedVel = p5.Vector.add(this.vel, p5.Vector.mult(bodies[t].vel, bodies[t].mass/this.mass));
              let newMass = this.mass + bodies[t].mass;
              let newDiameter = 2*sqrt(((PI * sq(this.diameter/2)) + (PI * sq(bodies[t].diameter/2)))/PI);
              let newColor = this.color;

              bodies.splice(t, t+1);
              bodies.splice(bodies.indexOf(this), bodies.indexOf(this)+1);

              playSound("SOUND/collide.mp3");

              placeBody(newName, newPos.x, newPos.y, combinedVel.x, combinedVel.y, newMass, newDiameter, newColor);
            }
          }
        }
      }
    }
  }

  display() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.diameter/pixelKmRatio);
    fill(255);
    textAlign(CENTER);
    text(this.name, this.pos.x, this.pos.y-(this.diameter/pixelKmRatio/2)-2);
    textAlign(LEFT);
  }
}
