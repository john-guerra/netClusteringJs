export = netClustering;
export as namespace netClustering;

declare namespace netClustering {
    var version: string;
    interface DataObj {
        names: string[];
        useWeights: boolean;
        distances: any;
    }
    function buildTreeByCommunities(dataObj: DataObj,showNotes?:boolean): void;
    interface TreeNode {
        parent: TreeNode;
        leftChild: TreeNode;
        rightChild: TreeNode;
        weight: number;
        dQ: number;
    }
    interface TreeObj {
        tree: TreeNode[];
        root: TreeNode;
        names: string[];
        useWeights: boolean;
        distances: any;
    }
    function findSubCommunities(treeObj: TreeObj, depth: number, prevGroup?: any): void;
    interface Edge {
        source: number | string;
        target: number | string;
    }
    function cluster(nodes: any[], edges: Edge[], clusterAttr?: string, edgesCountAttr?: string): any[];

}