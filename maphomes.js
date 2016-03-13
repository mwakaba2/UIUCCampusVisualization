var canvas, stage, image, bitmap;
var homes = [];

function toQuad() {
  $(window).scrollTop(1200 - window.innerHeight / 2);
  $(window).scrollLeft(1900 - window.innerWidth / 2 + 250);
}

function init() {
  // $("#mapplaces").hide();

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

$("#clearhomes").on('click', function() {
  for(var i = stage.numChildren - 1; i > 0; i--){
    stage.removeChildAt(i);
  }
  stage.update();
  setTimeout(function () {
    toQuad();
  }, 100);
  homes = [];
});

$(function() {
  $("#search").on("keydown", function(e) {
    if(e.keyCode == 13){
      var keyword = $("input[name=keyword]").val();
      var rectangles = searchFilter(keyword);
      console.log(rectangles);
      for(var rectangle in rectangles){
        var northwest = rectangle[coord][0];
        var southeast = rectangle[coord][1];
        var topX = northwest[0];
        var topY = northwest[1];
        var botX = southeast[0];
        var botY = southeast[1];
        var g = new createjs.Graphics(createjs.Graphics.getRGB(212,93,0, 0.3));
        g.beginFill();
        g.drawRect(topX, topY, botX - topX, botY - topY);

        var s = new createjs.Shape(g);

        stage.addChild(s);
        stage.update();
      }
    }
  })
  $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 300,
    values: [ 1, 8 ],
    slide: function( event, ui ) {
      $( "#amount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
    }
  });
  $( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) +
    " - " + $( "#slider-range" ).slider( "values", 1 ) );
});
