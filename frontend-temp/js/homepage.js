$(document).ready(function() {

  var ctx = null;
  var objectList = [];
  var printList = [];
  var decc = 0.5;

  function makeObject(ix, iy) {
    console.log("Making at (" + ix + ", " + iy + ")");

    var newObject = {
      x: ix,
      y: iy,
      r: 10
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
      speed: 5,
      rotationSpeed: 0.5
    };

    printList.push(newPrint);
  }


  function init() {
    ctx = document.getElementById('background-animation').getContext('2d');


    makePrint(400, 400, 1);
    makePrint(400, 400, 1);
    makePrint(400, 400, 1);
    makePrint(400, 400, 1);
    makePrint(400, 400, 1);
    makePrint(400, 400, 1);
    makePrint(400, 400, 1);

    renderLoop();
  }


  function renderLoop() {
    update();
    render();
    requestAnimationFrame(renderLoop);
  }



  function update() {

    // update objects
    printList.forEach(function(ob) {

      // calculate new position
      ob.x += ob.speed * Math.sin(ob.d);
      ob.y += ob.speed * Math.cos(ob.d);

      // calculate movement direction
      ob.d += ob.rotationSpeed * (Math.random() - 0.5);


      // calculate potential object spawning
      ob.tc++;

      if (ob.tc > 5) {
        ob.tc = 0;
        makeObject(ob.x, ob.y);
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

      if (ob.r > decc) {
        ob.r -= decc;
      } else {
        ob.r = 0;
      }

    });

    for (var i = 0; i < objectList.length; ++i) {
      if (objectList[i].r == 0) {
        objectList.splice(i--, 1);
        console.log("object is dead. removing");
      }
    }
  }


  function render() {

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    printList.forEach(function(ob) {

      ctx.beginPath();
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#AAAAAA';
      ctx.arc(ob.x, ob.y, 5, 0, Math.PI * 2, true);
      ctx.stroke();

    });

    objectList.forEach(function(ob) {

      ctx.beginPath();
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#325FA2';
      ctx.arc(ob.x, ob.y, ob.r, 0, Math.PI * 2, true);
      ctx.stroke();

    });


  }

  init();

});
