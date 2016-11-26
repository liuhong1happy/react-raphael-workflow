require('../less/style.less')
const React = require('react');
const ReactDOM = require('react-dom');

const {Paper} = require('react-raphael');

const StartNode = require('./start-node');
const EndNode = require('./end-node');

const Arrow = require('./arrow');

const ImgGrid = require("../images/grid.gif");

const SimpleNode = require('./simple-node');
//const MergeNode = require('./merge-node');
//const BranchNode = require('./branch-node');
//const SyncNode = require('./sync-node');

const NodeTable = {
	"start-node": SimpleNode,
	"end-node": SimpleNode,
    "simple-node": SimpleNode,
//	"merge-node": MergeNode,
//	"branch-node": BranchNode,
//	"sync-node": SyncNode
}

class Node extends React.Component {
	render(){
		var { type,...others } = this.props;
		return React.createElement(NodeTable[type],{...others},null);
	}
}

class WorkFlow extends React.Component {
	constructor(props){
		super(props);
		this.state = {...props}
		this.state.loaded = false;
        this.state.update = null;
	} 
    getNodeById(id){
        var nodes = this.state.nodes;
        var finds = nodes.filter(function(ele){ return ele.id == id; })
        return finds[0] || {};
    }
    getLastArrowsByNodeId(id){
        var arrows = this.state.arrows;
        var finds = arrows.filter(function(ele){ return ele.next == id; })
        return finds;
    }
    getNextArrowsByNodeId(id){
        var arrows = this.state.arrows;
        var finds = arrows.filter(function(ele){ return ele.last == id; })
        return finds;
    }
    updateNodeAndArrow(lastNode,arrow,nextNode){
        var point = this.getStartEnd(lastNode,nextNode);
        arrow.x1= point.start.x;
        arrow.y1= point.start.y;
        arrow.x2= point.end.x;
        arrow.y2= point.end.y;
        var arrows = this.state.arrows;
        var finds = arrows.filter(function(ele){ return ele.id == arrow.id; })
        finds[0] = arrow;
        this.setState({
            arrows: arrows,
            update: "arrow"
        })
    }
    getStartEnd(lastNode, nextNode) {
        var bb1 = {x: lastNode.position.x, y: lastNode.position.y, width: lastNode.width, height: lastNode.height};
        var bb2 = {x: nextNode.position.x, y: nextNode.position.y, width: nextNode.width, height: nextNode.height};
        var p = [
                { x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
                { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
                { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
                { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 },
                { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
                { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
                { x: bb2.x - 1, y: bb2.y + bb2.height / 2 },
                { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }
            ];
        var d = {}, dis = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 4; j < 8; j++) {
                var dx = Math.abs(p[i].x - p[j].x),
                    dy = Math.abs(p[i].y - p[j].y);
                if (
                     (i == j - 4) ||
                     (((i != 3 && j != 6) || p[i].x < p[j].x) &&
                     ((i != 2 && j != 7) || p[i].x > p[j].x) &&
                     ((i != 0 && j != 5) || p[i].y > p[j].y) &&
                     ((i != 1 && j != 4) || p[i].y < p[j].y))
                   ) {
                    dis.push(dx + dy);
                    d[dis[dis.length - 1]] = [i, j];
                }
            }
        }
        if (dis.length == 0) {
            var res = [0, 4];
        } else {
            res = d[Math.min.apply(Math, dis)];
        }
        var result = {};
        result.start = {};
        result.end = {};
        result.start.x = p[res[0]].x;
        result.start.y = p[res[0]].y;
        result.end.x = p[res[1]].x;
        result.end.y = p[res[1]].y;
        return result;
    }
	handleChange(e, id, data){
		var key = data.key;
        var value = data.value;
        var node = this.getNodeById(id);
        node[key] = value;
        if(key=="position"){
            switch(node.type){
                case "start-node":
                    var nextArrow = this.getNextArrowsByNodeId(id)[0] || {};
                    var nextNode = this.getNodeById(nextArrow.next);
                    this.updateNodeAndArrow(node,nextArrow,nextNode);
                    break;
                case "end-node":
                    var lastArrow = this.getLastArrowsByNodeId(id)[0] || {};
                    var lastNode = this.getNodeById(lastArrow.last);
                    this.updateNodeAndArrow(lastNode,lastArrow,node);
                    break;
            }
        }
	}
	
	render(){
			var {width,height,arrows,nodes,update} = this.state;
			var handleChange = this.handleChange.bind(this);
			var style = { backgroundImage: "url("+ImgGrid+")",width,height,border: "3px solid #000"};
			return (<Paper width={width} height={height} container={{ style: style}}>
				{
			 		arrows.map(function(ele,pos){
			 			return (<Arrow key={ ele.last+"->"+ele.next } {...ele} update={update}/>)
					})
				}
				{
			 		nodes.map(function(ele,pos){
			 			return (<Node key={ ele.type+"->"+ele.id } {...ele} update={update} onChange={handleChange} />)
					})
				}
			</Paper>)
	}
}

WorkFlow.propTypes = { 
	width: React.PropTypes.number, 
	height: React.PropTypes.number,
	arrows: React.PropTypes.array,
	nodes: React.PropTypes.array
};
					
WorkFlow.defaultProps = { 
	width: 600, 
	height: 400, 
	arrows: [
		{ id:"default-arrow", last: "start", next: "end", x1: 70, y1: 60, x2: 70, y2: 320 }
	],
	nodes: [
		{ type: "start-node", position: { x: 20,y: 20 }, width: 100, height: 40, r: 20, text: "Start" ,id: "start"},
		{ type: "end-node", position: { x: 20,y: 320 }, width: 100, height: 40, r: 20, text: "End", id: "end" }
	]
};
							  
module.exports = WorkFlow;