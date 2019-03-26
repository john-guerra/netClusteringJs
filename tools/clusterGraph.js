graph = require("./ieeevisNetwork.json");
netClustering = require("./netClustering.js");
var jsonfile = require('jsonfile')

var dictNodes = {};


var filteredNodes = graph.nodes.filter(function (d) { return d.influential=== true; });
filteredNodes = filteredNodes.concat(graph.nodes.filter(function (d) { return d.influential!== true; }).slice(0));

filteredNodes.forEach(function (d) {
	dictNodes[d.id] = d;
});

var links = graph.links.map(function (d) {
	return {source:dictNodes[d.source], target:dictNodes[d.target]};
});

netClustering.cluster(graph.nodes, links);
// graph.links = links;

var file = './ieeevisNetworkClustered.json'
jsonfile.writeFile(file, graph, function (err) {
  console.error(err)
})