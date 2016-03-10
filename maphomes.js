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
  image.src = "geometry.png";
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
