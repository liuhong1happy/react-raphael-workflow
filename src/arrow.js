const React = require('react');
const { Raphael,Path } = require('react-raphael');

class Arrow extends React.Component {
	getArrowPath(x1, y1, x2, y2, size) {
            var angle = Raphael.angle(x1, y1, x2, y2); //得到两点之间的角度
            var a45 = Raphael.rad(angle - 45); //角度转换成弧度
            var a45m = Raphael.rad(angle + 45);
            var x2a = x2 + Math.cos(a45) * size;
            var y2a = y2 + Math.sin(a45) * size;
            var x2b = x2 + Math.cos(a45m) * size;
            var y2b = y2 + Math.sin(a45m) * size;
            var result = ["M", x1, y1, "L", x2, y2, "L", x2a, y2a, "M", x2, y2, "L", x2b, y2b];
            return result;
	}
	render(){
		var {x1,y1,x2,y2} = this.props;
		var pathString = this.getArrowPath(x1,y1,x2,y2,10);
		return (<Path d={pathString} ></Path>)
	}
}
				
module.exports = Arrow;