var utils = require('./utils.js');

var arrayToObject = utils.arrayToObject;
var objectToArray = utils.objectToArray;
var groupBy = utils.groupBy;
var flatten = utils.flatten;

// TODO: Add groups metadata
function Data(data) {
  this.data = arrayToObject(data);
  this.length = data.length;
  this.cols = Object.keys(this.data);
}

Data.prototype.mapCols = function(mapping) {
  for (let key in mapping) {
    this.data[key] = this.data[mapping[key]];
  }
}

Data.prototype.asArray = function() {
  return objectToArray(this.data);
}

Data.prototype.asObject = function() {
  return this.data;
}

// Take an dataset and produce an object of datasets grouped by the by variable
Data.prototype.groupBy = function(by) {

    var groups = groupBy(this.data, by);

    for (let group in groups) {
        groups[group] = new Data(groups[group]);
    }
    
    return groups;
}

module.exports = Data;