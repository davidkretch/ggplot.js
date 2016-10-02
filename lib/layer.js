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