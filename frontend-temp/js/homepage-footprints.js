// footprint object control
var printList = [];

function addCSSFootprint(x, y, d, left) {
  var newPrint = "<div class='footprint' style='" +
    "-webkit-transform: rotate(" + d + "rad);  transform: rotate(" + d +
    "rad); top:" + y + "px; left:" + x + "px;";

  if (left) {
    //newPrint += "-webkit-transform: scaleX(-1);transform: scaleX(-1);";
  }

  newPrint += "'>  </div>";


  $("#footprints").append(newPrint);
}

function makeObject(ix, iy, id, left) {

  addCSSFootprint(ix, iy, id, left)
}

function makePrint(ix, iy, id) {
  var newPrint = {
    x: ix,
    y: iy,
    d: id,
    tc: 0,
    speed: 5,
    rotationSpeed: 0.4,
    leftFlag: false
  };

  printList.push(newPrint);
}


function init() {

  makePrint(400, 400, 1);
  makePrint(400, 400, 1);

  updateLoop(Date.now());
}


function updateLoop(lastUpdateTime) {
  var currentTime = Date.now();
  var dt = currentTime - lastUpdateTime;
  update(dt);

  // request new frame
  setTimeout(function() {
    updateLoop(currentTime);
  }, 100);

  // setTimeout(function() {
  //   addCSSFootprint(100, 100, 1);
  // }, 2000);
}



function update(deltaTime) {

  // update objects
  printList.forEach(function(ob) {

    // calculate new position
    ob.x -= ob.speed * Math.sin(ob.d);
    ob.y += ob.speed * Math.cos(ob.d);

    // calculate movement direction
    ob.d += ob.rotationSpeed * (Math.random() - 0.5);


    // calculate potential object spawning
    ob.tc++;

    if (ob.tc > 7 + 2 * (Math.random() - 0.5)) {
      ob.tc = 0;
      makeObject(ob.x, ob.y, ob.d, ob.leftFlag);
      ob.leftFlag = !ob.leftFlag;
    }

    // position correction
    var width = window.innerWidth;
    var height = window.innerHeight;

    if (ob.x < 0) {
      ob.x = width;
    }

    if (ob.y < 0) {
      ob.y = height;
    }


    if (ob.x > width) {
      ob.x = 0;
    }


    if (ob.y > height) {
      ob.y = 0;
    }

  });

}



$(document).ready(function() {

  // setTimeout(function() {
  //   addCSSFootprint(100, 100, 1);
  // }, 2000);

  init();



});
