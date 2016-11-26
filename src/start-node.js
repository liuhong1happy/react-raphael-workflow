const React = require('react');
const { Set, Rect, Text } = require('react-raphael');
class StartNode extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			loaded: false
		}
	}
	componentDidMount(){
		this.handleMove = this.handleMove.bind(this);
		this.handleStart = this.handleStart.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.setState({
			loaded: true
		})
		if(this.props.onChange){
			var {id} = this.props;
			this.props.onChange(null, id, {
				key: "loaded",
				value: true
			})
		}
	}
	handleMove(dx,dy,x,y,e){
		if(!this.drag) return;
		if(this.props.onChange){
			var {id, position} = this.props;
			this.props.onChange(e, id, {
				key: "position",
				value: {
					x: position.x + dx,
					y: position.y + dy
				}
			})
			var rect = this.refs.rect.getElement();
			rect.attr({
				x: this.xx + dx + this.dx,
				y: this.yy + dy + this.dy
			})
		}
		this.drag = true;
	}
	handleStart(x,y,e){
		this.drag = true;
		var rect = this.refs.rect.getElement();
		var rx = rect.attr("x");
		var ry = rect.attr("y");
		this.xx = x;
		this.yy = y;
		this.dx = rx - x;
		this.dy = ry - y;
	}
	handleEnd(e){
		this.drag = false;
	}
	render(){
		var {width,height,position,r,text} = this.props;
		if(this.drag){
			position = this.state.position;
			console.log(position);
		}
		var center = {
			x: position.x + width /2,
			y: position.y + height /2
		}
		return (<Set>
				<Rect ref="rect" width={ width } height={ height } x={ position.x } y={ position.y } r={r} attr={{"fill": "#fff"}}
					drag={{move: this.handleMove, start: this.handleStart, end: this.handleEnd }}
				></Rect>
				<Text x={center.x} y={center.y} text={text}></Text>
				</Set>)
	}
}
				
module.exports = StartNode;