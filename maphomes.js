/* Initialize map variables */
var canvas, stage, image, bitmap, map_container, homes_container, point_container, alpha, alphamask, alphastage;

/* Initialize filter variables */
var point = [];
var homes = [];
var topX, topY, botX, botY;
var sliderRange = [1, 8];
var toggle = "nothing";

/* initialize on page load */
function init() {
  toQuad();

  alpha = 0.5;
  alphamask = document.getElementById("alphamask");
  alphastage = new createjs.Stage(alphamask);

	canvas = document.getElementById("maphomes");

	stage = new createjs.Stage(canvas);
  map_container = new createjs.Container();
  homes_container = new createjs.Container();
  point_container = new createjs.Container();
  stage.addChild(map_container, homes_container, point_container);
  var bg = new createjs.Shape();
  bg.graphics.beginFill("#222");
  bg.graphics.drawRect(0, 0, 3675, 4200);
  map_container.addChild(bg);

  image = new Image();
  image.src = "birdseye.png";
  bitmap = new createjs.Bitmap(image);

  setTimeout(function () {
    map_container.addChild(bitmap);
    stage.update();
  }, 1500);

  stage.removeAllEventListeners();

  stage.update();
}


/* Repositions screen to quad*/
function toQuad() {
  $(window).scrollTop(1200 - window.innerHeight / 2);
  $(window).scrollLeft(1900 - window.innerWidth / 2 + 250);
}


/* Create homes rectangle */
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
  }

  homes.push([[topX, topY],[botX, botY]]);
  recalculate();
  stage.removeAllEventListeners("stagemouseup");
  stage.addEventListener("stagemousedown", handleMouseDown);
}


/* Creates point */
function handleClick(event) {
  point = [];
  point[0] = stage.mouseX;
  point[1] = stage.mouseY;
  point_container.removeAllChildren();
  recalculate();
}


/* clears map except for background and map layers */
function clearMap(){
  for(var i = stage.numChildren - 1; i > 1; i--){
    stage.removeChildAt(i);
  }
  stage.update();
}

/* user interface */
$(function() {

  /* alpha slider */
  $( "#alpha-range" ).slider({
    min: 0,
    max: 3,
    value: 1,
    step: 0.1,
    slide: function( event, ui ) {

      alpha = (ui.value) * (ui.value) * (ui.value) / 27;
      console.log(alpha);
      recalculate();
    }
  });

  /* search box */
  $("#search").on("keypress", function(e) {
    if(e.keyCode == 13) {
      recalculate();
    }
  })

  /* semester slider */
  $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 99,
    values: [ 1, 8 ],
    slide: function( event, ui ) {
      if (ui.values[0] === ui.values[1]) {
        if (ui.values[0] === 1) {
          $( "#amount" ).html( ui.values[ 0 ] + " semester");
        } else if (ui.values[0] === 0) {
          $( "#amount" ).html( "never lived in the area");
        } else {
          $( "#amount" ).html( ui.values[ 0 ] + " semesters");
        }
      } else {
        $( "#amount" ).html( ui.values[ 0 ] + "–" + ui.values[ 1 ] + " semesters");
      }

      sliderRange[0] = ui.values[0];
      sliderRange[1] = ui.values[1];

      recalculate();
    }
  });

  /* semester slider label */
  $( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) +
    " - " + $( "#slider-range" ).slider( "values", 1 ) );

  /* colleges and vehicles */
  $('input[type="checkbox"][name="colleges"], input[type="checkbox"][name="vehicles"]').on('change',function() {
    recalculate();
  });

/* cursor toggles */
  $( "#examine" )
    .button()
    .click(function() {
      if (toggle !== "examine") {
        $("#cursor .help-block").html("<b>Current mode: Examine point</b><br>Click and drag on the map to designate a point. Labels will be filtered by those touching that point. You can only designate one point at a time.")
        $("#examine").addClass("current");
        $("#examine").html("Clear point");
        $("#living").removeClass("current");
        $("#living").html("Home filter");
        $("#nothing").removeClass("current");
        stage.removeAllEventListeners("stagemousedown");
        stage.addEventListener("stagemousedown", handleClick);
      } else {
        point_container.removeAllChildren();
        point = [];
        recalculate();
      }
      toggle = "examine";
    });
});

$(function() {
  $( "#living" )
    .button()
    .click(function() {
      if (toggle !== "living") {
        $("#cursor .help-block").html("<b>Current mode: Home filter</b><br>Click and drag on the map to create a rectangle. Labels will be filtered by people who have lived in that area. You can draw multiple rectangles.")
        $("#examine").removeClass("current");
        $("#examine").html("Examine point");
        $("#living").addClass("current");
        $("#living").html("Clear homes");
        $("#nothing").removeClass("current");
        stage.removeAllEventListeners("stagemousedown");
        stage.addEventListener("stagemousedown", handleMouseDown);
      } else {
        homes_container.removeAllChildren();
        homes = [];
        recalculate();
      }
      toggle = "living";
    });
});

$(function() {
  $( "#nothing" )
    .button()
    .click(function() {
      if (toggle !== "examine") {
        $("#cursor .help-block").html("<b>Current mode: None</b><br>Click on a button below to change input modes.")
        $("#examine").removeClass("current");
        $("#examine").html("Clear point");
        $("#living").removeClass("current");
        $("#living").html("Home filter");
        $("#nothing").addClass("current");
        clearMap();
        point = [];
        homes = [];
        recalculate();
        stage.removeAllEventListeners("stagemousedown");
      }
      toggle = "none";
    });
});


/* graphics */

function drawFog(rectangles) {

  alphastage.removeAllChildren();

  var s = new createjs.Shape();

  s.graphics.beginFill("rgba(0, 255, 0, 0.05)");
  s.graphics.drawRect(0, 0, 3675, 4200);
  alphastage.addChild(s);


  for (var i in rectangles) {
    var rectangle = rectangles[i];
    var northwest = rectangle["coord"][0];
    var southeast = rectangle["coord"][1];
    var topX = northwest[0];
    var topY = northwest[1];
    var botX = southeast[0];
    var botY = southeast[1];
    var sh = new createjs.Shape();
    sh.graphics.beginFill("rgba(0,0,255," + alpha + ")");
    sh.graphics.drawRect(topX, topY, botX - topX, botY - topY);
    alphastage.addChild(sh);
  }

  alphastage.update();

  alphastage.cache(0, 0, 3675, 4200);

  bitmap.filters = [new createjs.AlphaMaskFilter(alphastage.cacheCanvas)];
  bitmap.cache(0, 0, 3675, 4200);
}

function drawFilter() {
  homes_container.removeAllChildren();
  point_container.removeAllChildren();

  if (point.length > 0) {
    var g = new createjs.Graphics();
    g.beginFill("rgba(255,0,0,0.8)");
    g.drawCircle(point[0], point[1], 15);
    var s = new createjs.Shape(g);
    point_container.addChild(s);
  }

  if (homes.length > 0) {
    for (h in homes) {
      var house = homes[h];
      var northwest = house[0];
      var southeast = house[1];
      var topX = northwest[0];
      var topY = northwest[1];
      var botX = southeast[0];
      var botY = southeast[1];

      var s = new createjs.Shape();
      s.graphics.beginFill("rgba(255,0,0,0.4)");
      s.graphics.drawRect(topX, topY, botX - topX, botY - topY);
      homes_container.addChild(s);
    }
  }

}


/* AlphaMaskFilter example */
//
// var stage;
//
//
// function init() {
//
// 	image = new Image();
// 	image.src = "http://www.harrisremovals.co.uk/wp-content/uploads/2014/07/Crunch-time-in-the-removals-game.jpg";
//
// 	stage = new createjs.Stage("testCanvas");
//
//     var box = new createjs.Shape();
//       box.graphics.beginLinearGradientFill(["#000000", "rgba(0, 0, 0, 0)"], [0, 1], 0, 0, 100, 100)
//       box.graphics.drawRect(0, 0, 100, 100);
//       box.cache(0, 0, 100, 100);
//
//   var bmp = new createjs.Bitmap(image);
//   bmp.filters = [
//       new createjs.AlphaMaskFilter(box.cacheCanvas)
//   ];
//   bmp.cache(0, 0, 100, 100);
//
//
//   var bmp2 = new createjs.Bitmap("http://www.pyromaniac.com/system/marquee_larges/608/original/crunch-time-large.jpg");
//
//     stage.addChild(bmp2);
//     stage.addChild(bmp);
//   stage.update();
// }
