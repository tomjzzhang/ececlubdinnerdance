$(document).ready(function() {

  // footprint object control
  var ctx = null;
  var objectList = [];
  var printList = [];
  var decc = 0.015; // hello!

  // canvas control
  var canvas = document.getElementById('background-animation');
  var context = canvas.getContext('2d');
  var fps = 0;

  // iamge loading
  var imageObj = new Image();

  imageObj.onload = function() {
    //init();
  };
  imageObj.src = 'images/footprint.png';

  // mouse position
  var mousex = 0,
    mousey = 0;

  $("body").mousemove(function(e) {
    mousex = e.pageX;
    mousey = e.pageY;
  })


  window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  function resizeCanvas() {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
  }



  function makeObject(ix, iy, id, left) {

    var newObject = {
      x: ix,
      y: iy,
      d: id,
      op: 0.5,
      leftFlag: left
    };

    objectList.push(newObject);

    return newObject;
  }

  function makePrint(ix, iy, id) {
    var newPrint = {
      x: ix,
      y: iy,
      d: id,
      tc: 0,
      speed: 2.5,
      rotationSpeed: 0.2,
      leftFlag: false
    };

    printList.push(newPrint);
  }


  function init() {

    window.addEventListener('resize', resizeCanvas, false);

    // Draw canvas border for the first time.
    resizeCanvas();

    makePrint(400, 400, 1);
    makePrint(400, 400, 1);

    renderLoop(Date.now());
  }


  function renderLoop(lastUpdateTime) {
    var currentTime = Date.now();
    var dt = currentTime - lastUpdateTime;
    update(dt);
    render(dt, context);

    // calculate average FPS
    if (dt > 1)
      fps = (fps + 1000.0 / dt) / 2.0;

    // request new frame
    requestAnimFrame(function() {
      renderLoop(currentTime);
    });
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

      if (ob.tc > 15 + 4 * (Math.random() - 0.5)) {
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


    // update objects
    objectList.forEach(function(ob) {

      if (ob.op > decc) {
        ob.op -= decc;
      } else {
        ob.op = 0;
      }

    });

    for (var i = 0; i < objectList.length; ++i) {
      if (objectList[i].op == 0) {
        objectList.splice(i--, 1);
      }
    }


    // write debug info
    var dbinfo = "=============[ CANVAS DEBUG ]============== <br>";
    dbinfo += "There are " + objectList.length +
      " objects alive.<br>";
    dbinfo += "Current active spawners: " + printList.length + "<br>";
    dbinfo += "dTIME: " + deltaTime + "<br>";
    dbinfo += "avgFPS: " + fps + "<br>";
    dbinfo += "MOUSE: (" + mousex + ", " + mousey + ") <br>";


    //document.getElementById("canvas-debug").innerHTML = dbinfo;
  }


  function render(deltaTime, ctx) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // printList.forEach(function(ob) {
    //
    //   ctx.beginPath();
    //   ctx.lineWidth = 14;
    //   ctx.strokeStyle = '#AAAAAA';
    //   ctx.arc(ob.x, ob.y, 5, 0, Math.PI * 2, true);
    //   ctx.stroke();
    //
    // });

    objectList.forEach(function(ob) {

      ctx.save();

      ctx.globalAlpha = ob.op;
      ctx.translate(ob.x, ob.y);
      ctx.rotate(ob.d);
      if (ob.leftFlag) {
        ctx.scale(-1, 1);
      }


      ctx.drawImage(imageObj, 0, 0, imageObj.width / 4, imageObj.height /
        4);

      ctx.restore();

      // ctx.beginPath();
      // ctx.lineWidth = 14;
      // ctx.strokeStyle = '#325FA2';
      // ctx.arc(ob.x, ob.y, ob.r, 0, Math.PI * 2, true);
      // ctx.stroke();

    });


  }

});
