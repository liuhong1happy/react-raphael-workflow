const React = require('react');
const ReactDOM = require('react-dom');

const {Paper} = require('react-raphael');

const StartNode = require('./start-node');
const EndNode = require('./end-node');

const Arrow = require('./arrow');

const ImgGrid = require("../images/grid.gif");

//const SimpleNode = require('./simple-node');
//const MergeNode = require('./merge-node');
//const BranchNode = require('./branch-node');
//const SyncNode = require('./sync-node');

const NodeTable = {
	"start-node": StartNode,
	"end-node": EndNode,
//	"simple-node": SimpleNode,
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
	}
			 
	handleChange(e, type, data){
		
	}
	
	render(){
			var {width,height,arrows,nodes} = this.state;
			var handleChange = this.handleChange.bind(this);
			var style = { backgroundImage: "url("+ImgGrid+")",width,height,border: "3px solid #000"};
			return (<Paper width={width} height={height} container={{ style: style}}>
				{
			 		arrows.map(function(ele,pos){
			 			return (<Arrow key={ ele.last+"->"+ele.next } {...ele} />)
					})
				}
				{
			 		nodes.map(function(ele,pos){
			 			return (<Node key={ ele.type+"->"+ele.id } {...ele} onChange={handleChange} />)
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
		{ last: "start", next: "end", x1: 70, y1: 60, x2: 70, y2: 320 }
	],
	nodes: [
		{ type: "start-node", position: { x: 20,y: 20 }, width: 100, height: 40, r: 20, text: "Start" ,id: "start"},
		{ type: "end-node", position: { x: 20,y: 320 }, width: 100, height: 40, r: 20, text: "End", id: "end" }
	]
};
							  
module.exports = WorkFlow;