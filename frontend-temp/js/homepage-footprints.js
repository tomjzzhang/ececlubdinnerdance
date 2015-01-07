// footprint object control
var printList = [];

var idCap = 100;
var idC = 0;

function scheduleErase(i) {
  setTimeout(function() {
    //console.log("removing " + "#ft" + idK);
    var el = document.getElementById('ft' + i);
    el.parentNode.removeChild(el);
  }, 2000);
}


function addCSSFootprint(x, y, d, left) {
  idC++;

  if (idC > idCap) {
    idC = 0;
  }



  var newPrint = "<div id=ft" + idC + " class='footprint";

  if (left) {
    newPrint += "left";
  }

  newPrint += "' style='" +
    "-webkit-transform: rotate(" + d + "rad);  transform: rotate(" + d +
    "rad); top:" + y + "px; left:" + x + "px;";

  if (left) {
    //newPrint += "-webkit-transform: scaleX(-1);transform: scaleX(-1);";
  }

  newPrint += "'>  </div>";


  $("#footprints").append(newPrint);

  setTimeout(scheduleErase(idC), 2000);
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

  //makePrint(400, 400, 1);
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

    if (ob.tc > 5) {
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

var x = 0;

function testLoop() {
  x += 0.1;

  addCSSFootprint(200, 200, x);

  setTimeout(function() {
    testLoop();
  }, 500);
}



$(document).ready(function() {

  // setTimeout(function() {
  //   addCSSFootprint(100, 100, 1);
  // }, 2000);

  init();

  //testLoop();

  addCSSFootprint(100, 100, 0, true);
  addCSSFootprint(100, 100, 0, false);


});
