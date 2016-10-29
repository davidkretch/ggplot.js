// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var data = [];
for (let i = 0; i < 100; i++) {
  data.push({x: Math.random(), y: Math.random(), group: randomInt(1, 3).toString()});
}

var p = new Plot(data, {x: "x", y: "y", color: "group"}, selector = "div.plot", width = 600, height = 400).
  geomPoint();
  
p.show();