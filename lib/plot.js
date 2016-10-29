var Data = require('./data.js');
var Layer = require('./layer.js');
var utils = require('./utils.js');

var arrayToObject = utils.arrayToObject;
var objectToArray = utils.objectToArray;
var groupBy = utils.groupBy;
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

  data.data.r = new Array(data.length).fill(mapping.size || 4);

  if (!("color" in mapping)) {
    data.data.group = new Array(data.length).fill("1");
  }

  var groups = data.groupBy(mapping.color || "group");

  var i = 0;

  var num_groups = Object.keys(groups).length

  for (let group in groups) {
    groups[group].data.color = new Array(data.length).fill(String(d3.hcl(15 + i * (375 - 15) / num_groups, 100, 65)));
    var point = new Layer('circle', 
                            {cx: 'x', cy: 'y', r: 'r', fill: 'color'}, 
                            groups[group]);

    this.layers.push(point);

    i += 1;
  }

  return this;
}

Plot.prototype.geomLine = function(mapping, data) {
  var data = this.data;
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