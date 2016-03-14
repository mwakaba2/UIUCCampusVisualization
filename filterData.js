var retrievedData = [];

$.getJSON( "data/retrieved_data.json", function( data ) {
  for(key in data){
    var dataObj = data[key];
    retrievedData.push(dataObj);
  }
});

var point = [1750, 925];
var testLabels = getLabels(point);
var testColleges = ['ENGR'];
var testSemesterRange = [5, 12];
var testTransportation = ['bus'];
var testKeyword = "Main Quad";

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



/**
 * Get the labels of rectangles that have the keywords in the label
 * @param {string} keywords
 * @return {array of strings} labels
 */
function searchFilter(keywords) {
  // $("#labels-list").empty();
  var rectangles = [];
  count_dict = {}
  for(var key in retrievedData){
    var object = retrievedData[key];
    var rectangle = object["rectangle"];

    if(rectangle == undefined){
      break;
    }
    var label = rectangle["label"];

    // case insensitive and global matchings
    var re = new RegExp(keywords,"gi");
    var matchings = label.match(re);
    if(matchings){
      label = label.toLowerCase()
      if(!(label in count_dict))
        count_dict[label] = 1
      else
        count_dict[label] += 1
      rectangles.push(rectangle);
    }
  }

  getAggregate(count_dict)


  return rectangles;
}

/**
 * Get the labels of rectangles that overlap with the point
 * @param {array of numbers} [x,y] The x and the y coordinate
 * @return {array of strings} labels
 */
function getLabels(point) {
  var pointX = point[0];
  var pointY = point[1];
  var labels = [];
  var count_dict = {}
  for(var key in retrievedData){
    var dataObj = retrievedData[key];
    var rectangle = dataObj["rectangle"];
    var northwest = rectangle["coord"][0];
    var southeast = rectangle["coord"][1];

    if(northwest[0] < pointX && pointX < southeast[0] && northwest[1] < pointY && pointY < southeast[1]){
      label = rectangle["label"]
      labels.push(label);

      if(!(label in count_dict))
        count_dict[label] = 1
      else
        count_dict[label] += 1
    }
  }
  getAggregate(count_dict)
  return labels;
}

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
 function filteredRectangles(colleges, semesterRange, transportation, homes) {
  var rectangles = [];
  count_dict = {}
  for(var key in retrievedData){
    var dataObj = retrievedData[key];
    var usr_info = dataObj["user_info"];
    var usr_colleges = usr_info["college"];
    var usr_semesters = parseInt(usr_info["semester"]);
    var usr_transportation = usr_info["transportation"];

    if(colleges.length == 0 || isSameSet(colleges, usr_colleges)){
      if(semesterRange[0] <= usr_semesters && usr_semesters <= semesterRange[1]){
        if(transportation.length == 0 || isSameSet(transportation, usr_transportation)){
          var usr_rectangle = dataObj["rectangle"];
          var label = usr_rectangle["label"];
          rectangles.push(usr_rectangle);
          if(!(label in count_dict))
            count_dict[label] = 1;
          else
            count_dict[label] += 1;
        }
      }
    }
  }
  getAggregate(count_dict);
  return rectangles;
 }


/**
 * Compares two arrays if they have the same values or not
 */
function isSameSet(arr1, arr2){
  return  $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
}
