
//
// function setDimensions(){
//
//   $("#divs").css("width", $(window).width() + "px");
//   $("#div1").css("width", $(window).width()/2 + "px");
//   $("#div2").css("width", $(window).width()/2 + "px");
//   $("#pic1").css("width", $(window).width()/2 + "px");
//   $("#pic2").css("width", $(window).width()/2 + "px");
//   $("#trans1").css("width", $(window).width()/2 + "px");
//   $("#trans2").css("width", $(window).width()/2 + "px");
//
//   $("#divs").css("height", $(window).height() + "px");
//   $("#div1").css("height", $(window).height() + "px");
//   $("#div2").css("height", $(window).height() + "px");
//   $("#pic1").css("height", $(window).height() + "px");
//   $("#pic2").css("height", $(window).height() + "px");
//   $("#trans1").css("height", $(window).height() + "px");
//   $("#trans2").css("height", $(window).height() + "px");
//
//   $("#div1").css("margin-top", -$(window).height() + "px");
// }


function switchImage(leftAfter, rightAfter){
  console.log("switching");

  // set switching content
  $("#trans1").css("background-image", "url('" + leftAfter + "')");
  //$("#pic1").html(leftInit);

  $("#trans2").css("background-image", "url('" + rightAfter + "')");
  //$("#pic2").html(rightInit);

  $( "#leftcolumn" ).animate({
    "margin-top": 0
  }, 1000, function() {
    // Animation complete.
    $( "#leftcolumn" ).css("margin-top", "-100vh");
    //$("#trans1").html(leftInit);
    $("#pic1").css("background-image",
      "url('" + leftAfter + "')");

  });


  $( "#rightcolumn" ).animate({
    "margin-top": "-100vh"
  }, 1000, function() {
    // Animation complete.
    $( "#rightcolumn" ).css("margin-top", "0vh");
    //$("#trans2").html(rightInit);
    $("#pic2").css("background-image",
      "url('" + rightAfter + "')");

  });
}


var counter = 0;
var counterCap = 2;

function switchLoop(){

  counter++;

  if(counter > counterCap){
    counter = 1;
  }

  setTimeout(function(){
    switchImage("resources/background" + counter + "-left.png",
                "resources/background" + counter + "-right.png");
  }, 2000);

  setTimeout(function(){
    switchLoop();
  }, 4000);
}

$(document).ready(function(){
  //setDimensions();

  // setTimeout(function(){
  //   switchImage("resources/background1-left.png",
  //               "resources/background1-right.png");
  // }, 2000);
  //switchLoop();
});
