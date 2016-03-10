

$.getJSON( "data/retrieved_data.json", function( data ) {
  var point = [1750, 925];
  var pointX = point[0];
  var pointY = point[1];
  var labels = [];
  for(var key in data){
  	var object = data[key];
	var rectangle = object["rectangle"];
	var northwest = rectangle["coord"][0];
	var southeast = rectangle["coord"][1];

	if(northwest[0] < pointX && pointX < southeast[0] && northwest[1] < pointY && pointY < southeast[1]){
		labels.push(rectangle["label"]);
	}
  }
  console.log(labels);
});