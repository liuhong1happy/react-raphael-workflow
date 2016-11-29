require('../less/style.less')
const React = require('react');
const ReactDOM = require('react-dom');

const {Paper} = require('react-raphael');

const Arrow = require('./arrow');

const ImgGrid = require("../images/grid.gif");
const Segment = require('./segment');

const SimpleNode = require('./simple-node');
//const MergeNode = require('./merge-node');
//const BranchNode = require('./branch-node');
//const SyncNode = require('./sync-node');

const NodeTable = {
	"start-node": SimpleNode,
	"end-node": SimpleNode,
    "simple-node": SimpleNode,
	"merge-node": SimpleNode,
	"branch-node": SimpleNode,
	"sync-node": SimpleNode
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
		this.state.selectId = null;
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
				case "simple-node":
                    var nextArrow = this.getNextArrowsByNodeId(id)[0] || {};
                    var nextNode = this.getNodeById(nextArrow.next);
                    var lastArrow = this.getLastArrowsByNodeId(id)[0] || {};
                    var lastNode = this.getNodeById(lastArrow.last);
					this.updateNodeAndArrow(node,nextArrow,nextNode);
                    this.updateNodeAndArrow(lastNode,lastArrow,node);
                    break;
				case "branch-node":
                    var nextArrows = this.getNextArrowsByNodeId(id) || [];
                    var lastArrow = this.getLastArrowsByNodeId(id)[0] || {};
                    var lastNode = this.getNodeById(lastArrow.last);
					for(var i=0; i<nextArrows.length; i++){
						var nextNode = this.getNodeById(nextArrows[i].next);
						this.updateNodeAndArrow(node,nextArrows[i],nextNode);
					}
                    this.updateNodeAndArrow(lastNode,lastArrow,node);
					break;
				case "sync-node":
				case "merge-node":
                    var nextArrow = this.getNextArrowsByNodeId(id)[0] || {};
                    var nextNode = this.getNodeById(nextArrow.next);
                    var lastArrows = this.getLastArrowsByNodeId(id) || [];
					for(var i=0; i<lastArrows.length; i++){
						var lastNode = this.getNodeById(lastArrows[i].last);
						this.updateNodeAndArrow(lastNode,lastArrows[i],node);
					}
                    this.updateNodeAndArrow(node,nextArrow,nextNode);
					break;
				default:
					break;
            }
        }
		if(key=="selectId"){
			this.setState({
				selectId: value,
				update: "node"
			})
		}
	}
	insertSimpleNode(){
		var selectId = this.state.selectId;
		if(!selectId) return;
		// 上一个节点
		var lastNode = this.getNodeById(selectId);
		if(lastNode.type=="end-node" || lastNode.type=="branch-node") return;
		// (和上一个节点间箭头)原节点间箭头
		var lastArrow = this.getNextArrowsByNodeId(selectId)[0] || {};
		// 构建线段
		var {x1,y1,x2,y2} = lastArrow;
		var oldSeg = new Segment(x1,y1,x2,y2);
		var seg = oldSeg.length()>90? oldSeg : oldSeg.add(50);
		var vector = { x: seg.x2 - x2, y: seg.y2 - y2 };
		// 下一个节点
		var nextNode = this.getNodeById(lastArrow.next);
		var position = nextNode.position;
		position.x = position.x + vector.x;
		position.y = position.y + vector.y;
		nextNode.position = position;
		// 计算新节点
		var segLen = seg.length();
		var {x2,y2} = seg.add(-segLen/2);
		var newNode = {
			type: "simple-node", 
			position: { x: x2-lastNode.width /2, y: y2 }, 
			width: 100, 
			height: 40, 
			r: 20, 
			text: "Simple Node",
			id: "simple-"+new Date().valueOf()+"-"+Math.random().toFixed(10)
		}
		// 计算新的 和上一个节点间箭头
		var lastPoint = this.getStartEnd(lastNode,newNode);
		lastArrow.x1 = lastPoint.start.x;
		lastArrow.y1 = lastPoint.start.y;
		lastArrow.x2 = lastPoint.end.x;
		lastArrow.y2 = lastPoint.end.y;
		lastArrow.next = newNode.id;
		// 计算新的 和下一个节点间箭头
		var nextPoint = this.getStartEnd(newNode,nextNode);
		var nextArrow = { id:"default-arrow-"+new Date().valueOf()+"-"+Math.random().toFixed(10), last: newNode.id, next: nextNode.id}
		nextArrow.x1 = nextPoint.start.x;
		nextArrow.y1 = nextPoint.start.y;
		nextArrow.x2 = nextPoint.end.x;
		nextArrow.y2 = nextPoint.end.y;
		
		var uArrows = [ lastArrow, nextArrow ];
		var uNodes = [ lastNode, newNode, nextNode ];
		
		// 如果下一节点不是结束节点，需要对后续节点重新更新坐标
		if(nextNode.type!="end-node"){
			var getNextArrowsByNodeId = this.getNextArrowsByNodeId.bind(this);
			var getNodeById = this.getNodeById.bind(this);
			var UpdateNode = function(id){
				var arrows = getNextArrowsByNodeId(id);
				for(var i=0;i<arrows.length;i++){
					arrows[i].x1 = arrows[i].x1 + vector.x;
					arrows[i].y1 = arrows[i].y1 + vector.y;
					arrows[i].x2 = arrows[i].x2 + vector.x;
					arrows[i].y2 = arrows[i].y2 + vector.y;
					uArrows.push(arrows[i]);
					if(arrows[i].next){
						var uNode = getNodeById(arrows[i].next);
						uNode.position = { x: uNode.position.x + vector.x, y: uNode.position.y + vector.y }
						uNodes.push(uNode);
					}
					UpdateNode(arrows[i].next)
				}
			}
			UpdateNode(nextNode.id);
		}
		
		var { arrows,nodes } = this.state;
		for(var i=0;i<uArrows.length;i++){
			var _arrows = arrows.filter(function(ele,pos){
				return ele.id == uArrows[i].id;
			})
			if(_arrows.length==0) {
				arrows.push(uArrows[i]);
			}else{
				_arrows[0] = uArrows[i];
			}
		}
		for(var i=0;i<uNodes.length;i++){
			var _nodes = nodes.filter(function(ele,pos){
				return ele.id == uNodes[i].id;
			})
			if(_nodes.length==0) {
				nodes.push(uNodes[i]);
			}else{
				_nodes[0] = uNodes[i];
			}
		}
		this.setState({
			nodes: nodes,
			arrows: arrows,
			update: null
		})
	}
	insertMergeBranchNode(lastNode,nextNode){
		
	}
	insertSyncBranchNode(lastNode,nextNode){
		
	}
	deleteSimpleNode(node){
		
	}
	render(){
			var {width,height,arrows,nodes,update,selectId} = this.state;
			var handleChange = this.handleChange.bind(this);
			var style = { backgroundImage: "url("+ImgGrid+")",width,height,border: "3px solid #000"};
			return (<Paper width={width} height={height} container={{ style: style}}>
				{
			 		arrows.map(function(ele,pos){
			 			return (<Arrow key={ ele.last+"->"+ele.next } {...ele} update={update} />)
					})
				}
				{
			 		nodes.map(function(ele,pos){
			 			return (<Node key={ ele.type+"->"+ele.id } {...ele} update={update} onChange={handleChange} selectId={selectId} />)
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
		{ id:"default-arrow-1", last: "start", next: "branch-node", x1: 300, y1: 60, x2: 300, y2: 100 },
		{ id:"default-arrow-2", last: "branch-node", next: "simple-node-1", x1: 300, y1: 140, x2: 200, y2: 180 },
		{ id:"default-arrow-3", last: "branch-node", next: "simple-node-2", x1: 300, y1: 140, x2: 400, y2: 180 },
		{ id:"default-arrow-4", last: "simple-node-1", next: "sync-node", x1: 200, y1: 220, x2: 300, y2: 260 },
		{ id:"default-arrow-5", last: "simple-node-2", next: "sync-node", x1: 400, y1: 220, x2: 300, y2: 260 },
		{ id:"default-arrow-6", last: "sync-node", next: "end", x1: 300, y1: 300, x2: 300, y2: 340 }
	],
	nodes: [
		{ type: "start-node", position: { x: 250,y: 20 }, width: 100, height: 40, r: 20, text: "Start" ,id: "start"},
		{ type: "branch-node", position: { x: 250,y: 100 }, width: 100, height: 40, r: 20, text: "Branch Node" ,id: "branch-node"},
		{ type: "simple-node", position: { x: 150,y: 180 }, width: 100, height: 40, r: 20, text: "Simple Node" ,id: "simple-node-1"},
		{ type: "simple-node", position: { x: 350,y: 180 }, width: 100, height: 40, r: 20, text: "Simple Node" ,id: "simple-node-2"},
		{ type: "sync-node", position: { x: 250,y: 260 }, width: 100, height: 40, r: 20, text: "Sync Node", id: "sync-node" },
		{ type: "end-node", position: { x: 250,y: 340 }, width: 100, height: 40, r: 20, text: "End", id: "end" }
	]
};
							  
module.exports = WorkFlow;