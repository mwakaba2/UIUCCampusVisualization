var canvas, stage, image, bitmap;
var homes = [];

var places = [];
var topX, topY, botX, botY, label;
var sliderRange = [1, 8];
function handleMouseDown(event) {
  topX = stage.mouseX;
  topY = stage.mouseY;
  botX = stage.mouseX;
  botY = stage.mouseY;

  stage.removeAllEventListeners("stagemousedown");
  stage.addEventListener("stagemouseup", handleMouseUp);
}

function handleMouseUp(event) {

  if (stage.mouseX === topX || stage.mouseY === topY) {

    // nothing (box is a line)

  } else {

    if (stage.mouseX > topX) {
      botX = stage.mouseX;
    } else {
      topX = stage.mouseX;
    }
    if (stage.mouseY > topY) {
      botY = stage.mouseY;
    } else {
      topY = stage.mouseY;
    }

    var g = new createjs.Graphics();
    g.beginFill(createjs.Graphics.getRGB(212,93,0, 0.3));
    g.drawRect(topX, topY, botX - topX, botY - topY);

    var s = new createjs.Shape(g);

    places.push([[topX, topY], [botX, botY]]);

    stage.addChild(s);
    stage.update();
  }

  stage.removeAllEventListeners("stagemouseup");
  stage.addEventListener("stagemousedown", handleMouseDown);
}

function handleCancel(event) {
  stage.removeChildAt(stage.numChildren - 1);
  stage.update();
}

function toQuad() {
  $(window).scrollTop(1200 - window.innerHeight / 2);
  $(window).scrollLeft(1900 - window.innerWidth / 2 + 250);
}

function init() {
  toQuad();

	canvas = document.getElementById("maphomes");

	stage = new createjs.Stage(canvas);

  image = new Image();
  image.src = "birdseye.png";
  bitmap = new createjs.Bitmap(image);

  setTimeout(function () {
    stage.addChild(bitmap);
    stage.update();
  }, 1500);

  stage.removeAllEventListeners();
  stage.addEventListener("stagemousedown", handleMouseDown);
  stage.update();

}

function handleClick(event) {
  var g = new createjs.Graphics();
  g.beginFill(createjs.Graphics.getRGB(212,93,0,0.3));
  g.drawCircle(0,0,30);

  var s = new createjs.Shape(g);
  s.x = stage.mouseX;
  s.y = stage.mouseY;

  homes.push([stage.mouseX, stage.mouseY]);

  console.log(homes);

  stage.addChild(s);
  stage.update();
}

function clearMap(){
  for(var i = stage.numChildren - 1; i > 0; i--){
    stage.removeChildAt(i);
  }
  stage.update();
}

$("#clearhomes").on('click', function() {
  // TODO: 
  
});



$(function() {
  $("#search").on("keydown", function(e) {
    if(e.keyCode == 13){
      var keyword = $("input[name=keyword]").val();
      var rectangles = searchFilter(keyword);
      var alpha = 0.99/rectangles.length;
      for(var i in rectangles){
        var rectangle = rectangles[i];
        var northwest = rectangle["coord"][0];
        var southeast = rectangle["coord"][1];
        var topX = northwest[0];
        var topY = northwest[1];
        var botX = southeast[0];
        var botY = southeast[1];
        
        var g = new createjs.Graphics();
        g.beginFill(createjs.Graphics.getRGB(96,110,178,alpha));
        g.drawRect(topX, topY, botX - topX, botY - topY);

        var s = new createjs.Shape(g);
        stage.addChild(s);
      }
    }
    stage.update();
  })
  $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 99,
    values: [ 1, 8 ],
    slide: function( event, ui ) {
      $( "#amount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      sliderRange[0] = ui.values[ 0 ];
      sliderRange[1] = ui.values[ 1 ];
      var colleges = $('input[type="checkbox"][name="colleges"]:checked').map(function(){
        return this.value;
      }).toArray();
      var vehicles = $('input[type="checkbox"][name="vehicles"]:checked').map(function(){
        return this.value;
      }).toArray();
      console.log(colleges, sliderRange, vehicles);
      filteredRectangles(colleges, sliderRange, vehicles, homes);
    }
  });
  $( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) +
    " - " + $( "#slider-range" ).slider( "values", 1 ) );

  $('input[type="checkbox"][name="colleges"], input[type="checkbox"][name="vehicles"]').on('change',function(){
    var colleges = $('input[type="checkbox"][name="colleges"]:checked').map(function(){
      return this.value;
    }).toArray();
    var vehicles = $('input[type="checkbox"][name="vehicles"]:checked').map(function(){
      return this.value;
    }).toArray();

    console.log(colleges, sliderRange, vehicles);
    filteredRectangles(colleges, sliderRange, vehicles, homes);
  });

});
