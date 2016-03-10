$.getJSON( "data/retrieved_data.json", function( data ) {
  var point = [1750, 925];
  var testLabels = getLabels(point);
  var testColleges = ['ENGR'];
  var testSemesterRange = [5, 12];
  var testTransportation = ['bus'];

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
      
      if(containsFilter(colleges, usr_colleges)){
        if(semesterRange[0] <= usr_semesters && usr_semesters <= semesterRange[1]){
          if(containsFilter(transportation, usr_transportation)){
            var usr_rectangle = object["rectangle"];
            rectangles.push(usr_rectangle);    
          }
        }
      }  
    }
    return rectangles;
   }


  /**
   * Return true or false when the user has one of the filtered attributes
   * @param {array of strings} filters
   * @param {array of strings} user info
   * @return {boolean} user_info contains filter
   */
   function containsFilter(filters, user_info){
      for(var i = 0; i < filters.length; i++){
        if(user_info.indexOf(filters[i]) > -1){
          return true;
        }
      }
      return false;
   }

   var testRectangles = filteredRectangles(testColleges, testSemesterRange, testTransportation);
   console.log(testRectangles);

});