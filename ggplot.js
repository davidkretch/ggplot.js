(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Plot = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Plot = require('./src/plot.js')

module.exports = Plot;
},{"./src/plot.js":4}],2:[function(require,module,exports){
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
},{"./utils.js":5}],3:[function(require,module,exports){
function Layer(shape, mapping, data) {
  this.shape = shape;
  this.mapping = mapping;
  this.data = data;
}

// Get bounds for mapped variables
Layer.prototype.bounds = function() {
  var bounds = {};
  for (let attribute in this.mapping) {
    var variable = this.mapping[attribute];
    bounds[variable] = [Math.min(...this.data.data[variable]), 
                         Math.max(...this.data.data[variable])];
  }
  return bounds;
}

// Translate a Layer to SVG
Layer.prototype.plot = function(plot, scales) {
  var g = plot.append("g");

  var el = g.selectAll(this.shape)
    .data(this.data.asArray())
    .enter()
    .append(this.shape);

  for (let attribute in this.mapping) {
    var variable = this.mapping[attribute];
    var scale = scales[variable] || function(x) { return x; };
    el.attr(attribute, function(d) { return scale(d[variable]); });
  }
}

module.exports = Layer;
},{}],4:[function(require,module,exports){
var Data = require('./data.js');
var Layer = require('./layer.js');
var utils = require('./utils.js');

var arrayToObject = utils.arrayToObject;
var objectToArray = utils.objectToArray;
var flatten = utils.flatten;

function Plot(data, mapping, selector, width, height) {
  this.data = new Data(data);
  this.mapping = mapping;
  this.data.mapCols(this.mapping);
  this.selector = selector;
  this.width = width || 600;
  this.height = height || 400;
  this.layers = [];
  this.scales = {};
}

Plot.prototype.show = function() {

  // Get min and max for each dimension
  var layer_bounds = [];
  for (let layer of this.layers) {
    layer_bounds.push(layer.bounds());
  }
  layer_bounds = arrayToObject(layer_bounds);
  
  // Set scales
  var plot_bounds = {};
  for (let variable in layer_bounds) {
    var values = flatten(layer_bounds[variable]);
    plot_bounds[variable] = {};
    plot_bounds[variable].min = Math.min(...values);
    plot_bounds[variable].max = Math.max(...values);
  }

  this.scales.x = d3.scaleLinear()
    .domain([plot_bounds.x.min, plot_bounds.x.max])
    .range([0, this.width]);

  this.scales.y = d3.scaleLinear()
    .domain([plot_bounds.y.min, plot_bounds.y.max])
    .range([0, this.height]);

  // Add bare plot area
  this.plot = d3.select(this.selector)
    .append('svg')
    .attr('width', this.width)
    .attr('height', this.height);

  // Add each layer
  for (let layer of this.layers) {
    layer.plot(this.plot, this.scales);
  }
}

Plot.prototype.geomPoint = function(mapping, data) {
  var data = this.data;
  var mapping = this.mapping;

  data.data.r = new Array(data.length).fill(mapping.size | 2);

  var point = new Layer('circle', 
                        {cx: 'x', cy: 'y', r: 'r'}, 
                        data);

  this.layers.push(point);

  return this;
}

Plot.prototype.geomLine = function(mapping, data) {
  var mapping = this.mapping;

  var x = data.data.x;
  var y = data.data.y;

  var lines = [];
  for (var i = 0; i < data.length - 1; i++) {
    lines.push({x1: x[i], y1: y[i], x2: x[i+1], y2: y[i+1]});
  }

  var data = new Data(lines);

  var line = new Layer('line', 
                       {x1: 'x1', y1: 'y1', x2: 'x2', y2: 'y2'}, 
                       data);

  this.layers.push(line);

  return this;
}

module.exports = Plot;
},{"./data.js":2,"./layer.js":3,"./utils.js":5}],5:[function(require,module,exports){
// Take an array of objects and convert to object of arrays
function arrayToObject(array) {
  var object = {};

  keys = Object.keys(array[0]);

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

  keys = Object.keys(object);
  rows = object[keys[0]].length;

  for (let i = 0; i < rows; i++) {
    row = {};
    for (let key of keys) {
      row[key] = object[key][i];
    }
    array.push(row);
  }
  
  return array;
}

// Flatten an array of arrays
function flatten(array) {
  return array.reduce(function(a, b) { return a.concat(b); });
}

module.exports = {arrayToObject, objectToArray, flatten}
},{}]},{},[1])(1)
});