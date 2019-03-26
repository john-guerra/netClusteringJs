netClustering.js
================

netClustering allows you to detect clusters in networks using the Clauset, Newman and Moore community detection algorithm directly from the browser, as simple as:

```
netClustering.cluster(nodes, edges);
```

and the clusters will be stored in the .cluster attribute of the nodes.

The code is based on an implementation created by Robin W. Spencer for his site [scaledinnovation.com](http://scaledinnovation.com/analytics/communities/communities.html), I wrapped it up on a container so it could be reused as a library

# Install

```javascript
npm install netclustering
```

# Usage

On node

```javascript
import netClustering from "netclustering";

var nodes = ["a", "b", "c"];
var links = [{source:0, target:1, count:1}];
var groups = netClustering.cluster(nodes, links );
```

For the web

```html
<html>
<script src="https://unpkg.com/navio/dist/navio.min.js"></script>
<script>
import netClustering from "netclustering";

var nodes = ["a", "b", "c"];
var links = [{source:0, target:1, count:1}];
var groups = netClustering.cluster(nodes, links );
</script>
</html>
```

