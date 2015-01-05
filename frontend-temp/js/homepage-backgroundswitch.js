
var counter = 1;
var counterCap = 2;

function CSSSwitchImage(leftAfter, rightAfter){
  console.log("switching");

  // set switching content
  $("#trans1").css("background-image", "url('" + leftAfter + "')");
  $("#trans2").css("background-image", "url('" + rightAfter + "')");


  $("#leftcolumn").attr("class", "animatable");
  setTimeout(function(){
    $("#leftcolumn").attr("class", "");
    $("#pic1").css("background-image", "url('" + leftAfter + "')");
  }, 500);

  $("#rightcolumn").attr("class", "animatablereverse");
  setTimeout(function(){
    $("#rightcolumn").attr("class", "");
    $("#pic2").css("background-image", "url('" + rightAfter + "')");
  }, 500);
}

function CSSSwitchLoop(){

  counter++;

  if(counter > counterCap){
    counter = 1;
  }

  setTimeout(function(){
    CSSSwitchImage("resources/background" + counter + "-left.png",
    "resources/background" + counter + "-right.png");
  }, 2000);

  setTimeout(function(){
    CSSSwitchLoop();
  }, 4000);
}

$(document).ready(function(){
  //setDimensions();

  CSSSwitchLoop();

});
