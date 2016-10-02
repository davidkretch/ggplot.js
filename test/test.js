var data = [];
for (let i = 0; i < 100; i++) {
  data.push({x: Math.random(), y: Math.random()});
}

var p = new Plot(data, {x: "x", y: "y"}, selector = "div.plot", width = 600, height = 400).
  geomPoint();
  
p.show();