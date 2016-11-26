const React = require('react');
const { Set, Rect, Text } = require('react-raphael');
class EndNode extends React.Component {
	render(){
		
		var {width,height,position,r,text} = this.props;
		var center = {
			x: position.x + width /2,
			y: position.y + height /2
		}
		return (<Set>
				<Rect width={ width } height={ height } x={ position.x } y={ position.y } r={r} attr={{"fill": "#fff"}}></Rect>
				<Text x={center.x} y={center.y} text={text}></Text>
				</Set>)
	}
}
				
module.exports = EndNode;