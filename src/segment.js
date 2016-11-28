var { Raphael } = require('react-raphael');

var Segment = function(x1, y1,x2,y2) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
}

Segment.prototype = {
	"angle": function(){
		return Raphael.angle(this.x1,this.y1,this.x2,this.y2);
	},
	"rad": function(){
		return Raphael.rad(Raphael.angle(this.x1,this.y1,this.x2,this.y2));
	},
	"length": function(){
		return Raphael.getTotalLength(["M",this.x1,this.y1,"L",this.x2,this.y2]);
	},
	"add": function(len){
		var rad = this.rad();
		var x3 = Math.cos(rad) * len;
		var y3 = Math.sin(rad) * len;
		return new Segment(this.x1,this.y1,this.x2-x3,this.y2-y3);
	}
}
window.Segment = Segment;

module.exports = Segment;
