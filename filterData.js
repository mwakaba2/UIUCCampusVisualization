var retrievedData = [];

$.getJSON( "data/retrieved_data.json", function( data ) {
  for(key in data){
    var dataObj = data[key];
    retrievedData.push(dataObj);
  }
});

function checkSemesters(user_semester) {
  if (user_semester < sliderRange[0] || user_semester > sliderRange[1]) {
    return false;
  }
  return true;
}

function checkVehicle(user_vehicles, vehicles) {
  if (_.intersection(user_vehicles, vehicles).length > 0) {
    return true;
  }
  return false;
}

function checkColleges(user_colleges, colleges) {
  if (_.intersection(user_colleges, colleges).length > 0) {
    return true;
  }
  return false;
}

function checkQuery(label, keyword) {
  var re = new RegExp(keyword,"gi");
  if (label.match(re) === null) {
    return false;
  }
  return true;
}

function checkPoint(coord, p) {
  var pointX = p[0];
  var pointY = p[1];
  var northwest = coord[0];
  var southeast = coord[1];

  if(northwest[0] < pointX && pointX < southeast[0] && northwest[1] < pointY && pointY < southeast[1]) {
    return true;
  }
  return false;
}

function checkHomes(h, user_homes) {
  for (var i in h) {
    for (var j in user_homes)
    if (checkPoint(h[i], user_homes[j])) {
      return true;
    }
  }
  return false;
}

/**
 * Get the aggregated labels of rectangles that have the keywords in the label
 * And post to labels-list
 * @param {string: int} dictionary of the count of each word
 * @return None
 */

function getAggregate(count_dict){
  $("#labels-list").empty();
  var tuples = [];
  for (var key in count_dict) tuples.push([key, count_dict[key]]);

  tuples.sort(function(a, b) {
    a = a[1];
    b = b[1];
    return a > b ? -1 : (a < b ? 1 : 0);
  });

  for (var i = 0; i < tuples.length; i++) {
    var key = tuples[i][0];
    var value = tuples[i][1];
    $("#labels-list").append("<li>"+ key + " <span class=\"badge\">" + value +"</span></li>");
  }
}

function recalculate() {

  var keyword = $("input[name=keyword]").val();
  var colleges = $('input[type="checkbox"][name="colleges"]:checked').map(function(){
    return this.value;
  }).toArray();
  var vehicles = $('input[type="checkbox"][name="vehicles"]:checked').map(function(){
    return this.value;
  }).toArray();

  var count_dict = {};
  var rectangles = [];

  for (var i in retrievedData) {
    var thing = retrievedData[i];
    var info = thing["user_info"];
    var user_colleges = info["college"];
    var user_semester = parseInt(info["semester"]);
    var user_vehicles = info["transportation"];
    if (user_vehicles.length === 0) {
      user_vehicles.push("walkOnly");
    }
    var user_homes = info["house"];
    var rectangle = thing["rectangle"];
    var label = rectangle["label"].toLowerCase();
    var coord = rectangle["coord"];

    if(rectangle == undefined){
      break;
    }

    var pass = true; // changes to false once rectangle fails a filter

    pass = checkSemesters(user_semester);

    if (pass && vehicles.length > 0) {
      pass = checkVehicle(user_vehicles, vehicles);
    }
    if (pass && colleges.length > 0) {
      pass = checkColleges(user_colleges, colleges);
    }
    if (pass && keyword !== "") {
      pass = checkQuery(label, keyword);
    }
    if (pass && point.length > 0) {
      pass = checkPoint(coord, point);
    }
    if (pass && homes.length > 0) {
      pass = checkHomes(homes, user_homes);
    }

    if (pass) {
      // labels.push(label);

      if(!(label in count_dict))
        count_dict[label] = 1
      else
        count_dict[label] += 1

      rectangles.push(rectangle);
    }

  }

  drawFog(rectangles);

  drawFilter();

  getAggregate(count_dict);

  stage.update();
}

/**
 * Get the labels of rectangles that have the keywords in the label
 * @param {string} keywords
 * @return {array of strings} labels
 */
// function searchFilter(keywords) {
//   // $("#labels-list").empty();
//   var rectangles = [];
//   count_dict = {};
//   for(var key in retrievedData){
//     var object = retrievedData[key];
//     var rectangle = object["rectangle"];
//
//     if(rectangle == undefined){
//       break;
//     }
//     var label = rectangle["label"];
//
//     // case insensitive and global matchings
//     var re = new RegExp(keywords,"gi");
//     var matchings = label.match(re);
//     if(matchings){
//       label = label.toLowerCase();
//       if(!(label in count_dict))
//         count_dict[label] = 1
//       else
//         count_dict[label] += 1
//       rectangles.push(rectangle);
//     }
//   }
//
//   getAggregate(count_dict)
//
//
//   return rectangles;
// }

/**
 * Get the labels of rectangles that overlap with the point
 * @param {array of numbers} [x,y] The x and the y coordinate
 * @return {array of strings} labels
 */
// function getLabels() {
//   var pointX = point[0];
//   var pointY = point[1];
//   var labels = [];
//   var count_dict = {}
//   for(var key in retrievedData){
//     var dataObj = retrievedData[key];
//     var rectangle = dataObj["rectangle"];
//     var northwest = rectangle["coord"][0];
//     var southeast = rectangle["coord"][1];
//
//     if(northwest[0] < pointX && pointX < southeast[0] && northwest[1] < pointY && pointY < southeast[1]){
//       label = rectangle["label"]
//       labels.push(label);
//
//       if(!(label in count_dict))
//         count_dict[label] = 1
//       else
//         count_dict[label] += 1
//     }
//   }
//   getAggregate(count_dict)
//   return labels;
// }

// setTimeout(function () {
//     console.log(getLabels(point));
//   }, 2000);

/**
 * Get filtered rectangles
 * @param {array of strings} List of colleges
 * @param {array of numbers} [start, end] semester range
 * @param {array of strings} List of transportation
 * @return {array of Rectangles} Rectangle dataObjs
 */
 // function filteredRectangles(colleges, semesterRange, transportation, homes) {
 //  var rectangles = [];
 //  count_dict = {}
 //  for(var key in retrievedData){
 //    var dataObj = retrievedData[key];
 //    var usr_info = dataObj["user_info"];
 //    var usr_colleges = usr_info["college"];
 //    var usr_semesters = parseInt(usr_info["semester"]);
 //    var usr_transportation = usr_info["transportation"];
 //
 //    if(colleges.length == 0 || isSameSet(colleges, usr_colleges)){
 //      if(semesterRange[0] <= usr_semesters && usr_semesters <= semesterRange[1]){
 //        if(transportation.length == 0 || isSameSet(transportation, usr_transportation)){
 //          var usr_rectangle = dataObj["rectangle"];
 //          var label = usr_rectangle["label"];
 //          rectangles.push(usr_rectangle);
 //          if(!(label in count_dict))
 //            count_dict[label] = 1;
 //          else
 //            count_dict[label] += 1;
 //        }
 //      }
 //    }
 //  }
 //  if(homes.length > 0){
 //    for(var rect in rectangles){
 //      var coords = rectangles[rec]["coord"];
 //      var northwest = coords[0];
 //      var southeast = coords[1];
 //      for(var h in homes){
 //        var hNW = homes[h][0];
 //        var nSE = homes[h][1];
 //        var overlapping = (northwest[1] > hNW[1] && hNW[1] > southeast[1]) || (northwest[1] < hNW[1] && hSE[1] < northwest[1]);
 //        if(!overlapping){
 //          rectangles.splice(rect, 1);
 //        }
 //      }
 //    }
 //  }
 //  getAggregate(count_dict);
 //  return rectangles;
 // }


/**
 * Compares two arrays if they have the same values or not
 */
// function isSameSet(arr1, arr2){
//   return  $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
// }
