// Take an array of objects and convert to object of arrays
function arrayToObject(array) {
  var object = {};

  var keys = Object.keys(array[0]);

  for (let key of keys) {
    object[key] = [];
  }

  for (let row of array) {
    for (let key of keys) {
      object[key].push(row[key]);
    }
  }

  return object;
}

// Take an object of arrays and covert to array of objects
function objectToArray(object) {
  var array = [];

  var keys = Object.keys(object);
  var rows = object[keys[0]].length;

  for (let i = 0; i < rows; i++) {
    row = {};
    for (let key of keys) {
      row[key] = object[key][i];
    }
    array.push(row);
  }
  
  return array;
}

// Take an dataset (object of arrays) and produce an object of datasets 
// grouped by the by variable
function groupBy(object, by) {
    var array = objectToArray(object);
    var groups = {};

    for (let row of array) {
        var group = row[by];
        if (group in groups) {
            groups[group].push(row);
        } else {
            groups[group] = [row];
        }
    }
    
    return groups;
}

// Flatten an array of arrays
function flatten(array) {
  return array.reduce(function(a, b) { return a.concat(b); });
}

module.exports = {arrayToObject, objectToArray, groupBy, flatten}