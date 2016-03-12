$.getJSON( "data/retrieved_data.json", function( data ) {
  var point = [1750, 925];
  var testLabels = getLabels(point);
  var testColleges = ['ENGR'];
  var testSemesterRange = [5, 12];
  var testTransportation = ['bus'];
  var testKeyword = "Main Quad";
  
  /**
   * Get the labels of rectangles that have the keywords in the label
   * @param {string} keywords
   * @return {array of strings} labels 
   */
  function searchFilter(keywords) {
    var labels = [];
    for(var key in data){
      var object = data[key];
      var rectangle = object["rectangle"];
      var label = rectangle["label"];

      // case insensitive and global matchings
      var re = new RegExp(keywords,"gi");
      var matchings = label.match(re);
      if(matchings){
        labels.push(label);
      }

    }
    return labels;
  }

  console.log(searchFilter(testKeyword));
  /**
   * Get the labels of rectangles that overlap with the point
   * @param {array of numbers} [x,y] The x and the y coordinate
   * @return {array of strings} labels 
   */
  function getLabels(point) {
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
    return labels;
  }
  
  // console.log(getLabels(point));


  /**
   * Get filtered rectangles
   * @param {array of strings} List of colleges 
   * @param {array of numbers} [start, end] semester range
   * @param {array of strings} List of transportation
   * @return {array of Rectangles} Rectangle objects
   */
   function filteredRectangles(colleges, semesterRange, transportation) {
    var rectangles = [];
    for(var key in data){
      var object = data[key];
      var usr_info = object["user_info"];
      var usr_colleges = usr_info["college"];
      var usr_semesters = parseInt(usr_info["semester"]);
      var usr_transportation = usr_info["transportation"];
      
      if(colleges.compare(usr_colleges)){
        if(semesterRange[0] <= usr_semesters && usr_semesters <= semesterRange[1]){
          if(transportation.compare(usr_transportation)){
            var usr_rectangle = object["rectangle"];
            rectangles.push(usr_rectangle);    
          }
        }
      }  
    }
    return rectangles;
   }


  /**
   * Compares two arrays if they have the same values or not 
   */
  Array.prototype.compare = function(nextArr) {
    if (this.length != nextArr.length) return false;
    for (var i = 0; i < nextArr.length; i++) {
        if (this[i].compare) { 
            if (!this[i].compare(nextArr[i])) return false;
        }
        if (this[i] !== nextArr[i]) return false;
    }
    return true;
  }


   // var testRectangles = filteredRectangles(testColleges, testSemesterRange, testTransportation);
   // console.log(testRectangles);

});