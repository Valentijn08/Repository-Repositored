var levens = 3;

class Raster {
  constructor(r, k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0; rij < this.aantalRijen; rij++) {
      for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
        rect(kolom * this.celGrootte, rij * this.celGrootte, this.celGrootte, this.celGrootte);
      }
    }
    pop();
  }
}

class Bom {
  constructor(x, y, stepSize) {
    this.x = x;
    this.y = y;
    this.stapGrootte = stepSize;
    this.direction = 1;
  }
  toon() {
    image(bomImage, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
  beweeg() {
    this.y += this.stapGrootte * this.direction;

    if (this.y <= 0 || this.y >= canvas.height - raster.celGrootte) {
      this.toggleDirection();
    }

    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  }
  toggleDirection() {
    this.direction *= -1;
  }
}

var bomPosities = [
  { x: 5, y: 6 }, 
  { x: 7, y: 5 }, 
  { x: 9, y: 4 }, 
  { x: 11, y: 3 }, 
  { x: 13, y: 2 } 
];


var rodeAppel = {
  x: null,
  y: null,
  toon() {
    image(rodeAppelImage, this.x, this.y, 50, 50);
  }
};

var groeneAppel = {
  x: null,
  y: null,
  xSnelheid: null,
  ySnelheid: null,
  toon() {
    image(groeneAppelImage, this.x, this.y, 50, 50);
  },
  beweeg() {
    this.x += this.xSnelheid;
    this.y += this.ySnelheid;

    if (this.x <= 0 || this.x >= canvas.width - 50) {
      this.xSnelheid *= -1;
    }
    if (this.y <= 0 || this.y >= canvas.height - 50) {
      this.ySnelheid *= -1;
    }
  }
};

class Jos {
  constructor() {
    this.x = 50;
    this.y = 200;
    this.animatie = [];
    this.frameNummer = 3;
    this.stapGrootte = null;
    this.gehaald = false;
  }
  wordtGeraakt(vijand) {
    return (this.x === vijand.x && this.y === vijand.y);
  }
  raakt(groeneAppel) {
    return (this.x === groeneAppel.x && this.y === groeneAppel.y);
  }
  raakt(rodeAppel) {
    return (this.x === rodeAppel.x && this.y === rodeAppel.y);
  }
  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x, 0, canvas.width);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  staatOpBom(bommenLijst) {
    for (var b = 0; b < bommenLijst.length; b++) {
      if (bommenLijst[b].x === this.x && bommenLijst[b].y === this.y) {
        return true;
      }
    }
    return false;
  }

  toon() {
    image(this.animatie[this.frameNummer], this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}


class Vijand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

var bommen = [];

function preload() {
  achtergrond = loadImage("images/backgrounds/karton.jpg");
  rodeAppelImage = loadImage("images/sprites/appel_2.png");
  groeneAppelImage = loadImage("images/sprites/appel_1.png");
  bomImage = loadImage("images/sprites/bom.png");
}

function setup() {
  canvas = createCanvas(900, 600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);

  raster = new Raster(12, 18);
  raster.berekenCelGrootte();

  for (var i = 0; i < bomPosities.length; i++) {
    var bomX = bomPosities[i].x * raster.celGrootte;
    var bomY = bomPosities[i].y * raster.celGrootte;

    var willekeurigeStapGrootte = random(1, 3) * raster.celGrootte / 5;
    bommen.push(new Bom(bomX, bomY, willekeurigeStapGrootte));
  }

  eve = new Jos();
  eve.stapGrootte = 1 * raster.celGrootte;
  for (var b = 0; b < 6; b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  rodeAppel.x = floor(random(1, raster.aantalKolommen - 1)) * raster.celGrootte;
  rodeAppel.y = floor(random(1, raster.aantalRijen - 1)) * raster.celGrootte;

  groeneAppel.x = floor(random(1, raster.aantalKolommen - 1)) * raster.celGrootte;
  groeneAppel.y = floor(random(1, raster.aantalRijen - 1)) * raster.celGrootte;
  groeneAppel.xSnelheid = raster.celGrootte / 2;
  groeneAppel.ySnelheid = raster.celGrootte / 2;

  alice = new Vijand(500, 200);
  alice.stapGrootte = 1 * eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(500, 400);
  bob.stapGrootte = 1 * eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");
}


function draw() {
  background(achtergrond);
  textFont("Comic Sans MS");
  fill(255, 255, 255);
  textSize(30);
  text("Je hebt " + levens + " levens over", 10, 40);
  raster.teken();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  rodeAppel.toon();
  groeneAppel.beweeg();
  groeneAppel.toon();

  for (var i = 0; i < bommen.length; i++) {
    bommen[i].beweeg();
    bommen[i].toon();

    console.log("Toon Eve, Alice en Bob");
    eve.toon();
    alice.toon();
    bob.toon();
  }
  
  function flitsScherm() {
    push();
    noStroke();
    fill(255, 0, 0, 150);
    rect(0, 0, canvas.width, canvas.height);
    setTimeout(() => {
      pop();
    }, 200);
  }

  if (eve.raakt(groeneAppel) && groeneAppel.x !== -100) {
    levens++;  
    groeneAppel.x = -100;
    groeneAppel.y = -100;
  }

  if (eve.raakt(rodeAppel) && rodeAppel.x !== -100) {
    levens++;  
    rodeAppel.x = -100; 
    rodeAppel.y = -100; 
  }
  
  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.staatOpBom(bommen)) {
    levens--;
    flitsScherm();
    for (var i = 0; i < bommen.length; i++) {
      if (eve.staatOpBom([bommen[i]])) {
        bommen[i].x = -1000; 
        bommen[i].y = -1000; 
        break; 
      }
    }
  }


  if (levens == 0) {
    background('red');
    fill('white'); 
    text("Game Over", 300, 250);
    noLoop();
  }

  if (eve.gehaald) {
    background('green');
    fill('white');
    text("Je hebt gewonnen!", 300, 250);
    noLoop();
  } 
}

