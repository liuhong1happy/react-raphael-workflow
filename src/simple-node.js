const React = require('react');
const { Set, Rect, Text } = require('react-raphael');
class SimpleNode extends React.Component {
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
		this.handleClick = this.handleClick.bind(this);
		this.setState({
			loaded: true
		})
        console.log("didmount");
		if(this.props.onChange){
			var {id} = this.props;
			this.props.onChange(null, id, {
				key: "loaded",
				value: true
			})
		}
	}
    shouldComponentUpdate(nextProps,nextState){
        if(this.drag) return false;
        if(nextProps.update=="node" || nextProps.update==null) return true;
        else return false;
        return true;
    }
	handleMove(dx,dy,x,y,e){
		if(!this.drag) return;
		if(this.props.onChange){
			var {id, width,height} = this.props;
            var position = {
				x: this.xx + dx + this.dx,
				y: this.yy + dy + this.dy
            }
			this.props.onChange(e, id, {
				key: "position",
				value: position
			})
			var rect = this.refs.rect.getElement();
            var text = this.refs.text.getElement();
			var select = this.refs.select.getElement();
			rect.attr(position)
            text.attr({
                x: position.x + width /2,
                y: position.y + height /2
            })
			select.attr({
                x: position.x -1,
                y: position.y -1
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
	handleClick(e){
		if(this.drag) return;
		var {selectId,id} = this.props;
		var selected = id==selectId;
		if(this.props.onChange){
			this.props.onChange(e, id, {
				key: "selectId",
				value: selected? null: id
			})
		}
	}
	render(){
		var {width,height,position,r,text,selectId,id} = this.props;
		if(this.drag){
			position = this.state.position;
		}
		var center = {
			x: position.x + width /2,
			y: position.y + height /2
		}

		return (<Set>
				<Rect ref="select" width={ width+2 } height={ height+2 } x={ position.x-1 } y={ position.y-1 } attr={{"stroke":"red","stroke-width": 2,"stroke-dasharray": "- "}} hide={id!=selectId}></Rect>
				<Rect ref="rect" width={ width } height={ height } x={ position.x } y={ position.y } r={r} attr={{"fill": "#fff"}}
					drag={{move: this.handleMove, start: this.handleStart, end: this.handleEnd }} click={this.handleClick}
				></Rect>
				<Text ref="text" x={center.x} y={center.y} text={text}></Text>
				</Set>)
	}
}
				
module.exports = SimpleNode;