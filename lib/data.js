var utils = require('./utils.js');

var arrayToObject = utils.arrayToObject;
var objectToArray = utils.objectToArray;
var flatten = utils.flatten;

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

module.exports = Data;