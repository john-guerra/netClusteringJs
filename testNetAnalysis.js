var newman = new NewmanClustering();
var groups = newman.cluster(["a", "b", "c"] , [{source:0, target:1, count:1}] );
console.log(groups);