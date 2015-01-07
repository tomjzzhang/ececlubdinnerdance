$('.item').height(window.innerHeight);
var $document = $(document.body);
var $revealBar = $('.red-container');
var wrapperHeight = $document.height();
var stepDistance = 101;
var documentHeight = window.innerHeight;
var positions = [];
var elements = $('.item:not(".main")');

// Cache heights and positions
for (var i = 0; i < elements.length; i++) {
  var $element = $(elements[i]);
  var height = $element.offset().top + documentHeight;
  if (height > wrapperHeight) {
    height = wrapperHeight;
  }
  positions.push(height * (i + 2));
}

console.log(positions);

var $nodes = $('.node');


$(document).scroll(function() {

  nodeTop = $document.scrollTop() + documentHeight + 1;
  var current = 0;

  // Active/non active states
  for (var i = 0; i < positions.length; i++) {
    if (nodeTop > positions[i]) {
      current = i;
      $nodes.eq(i).addClass('active');
    } else {
      $nodes.eq(i).removeClass('active');
    }
  }

  // Bar positioning, so sections can have different heights.
  var distanceToNext = 0;

  // Initial node, already has some of the bar filled.
  if (nodeTop < positions[0]) {
    var nextStep = (nodeTop - positions[current]) / (positions[current + 1] -
      positions[current]);

    // Calculating for node widths.
    var totalWidth = ((stepDistance) + (current * stepDistance) + (nextStep *
      stepDistance)) * 0.4;
    $revealBar.width((0.6 * stepDistance) + totalWidth);

    // Final node covered.
  } else if (nodeTop > positions[6]) {
    $revealBar.width(stepDistance * (current + 1));

    // regular nodes
  } else if (current < elements.length) {
    var nextStep = (nodeTop - positions[current]) / (positions[current + 1] -
      positions[current]);
    var totalWidth = stepDistance + (current * stepDistance) + (nextStep *
      stepDistance);
    $revealBar.width(totalWidth);
  }
})

// Clicking the nodes
$nodes.each(function(index) {
  var $node = $(this);
  $node.click(function() {
    $('html, body').animate({
      scrollTop: (positions[index] - documentHeight + 10)
    }, 1000);
  });
})
