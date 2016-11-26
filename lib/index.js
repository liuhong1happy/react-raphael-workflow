'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');

var _require = require('react-raphael'),
    Paper = _require.Paper;

var StartNode = require('./start-node');
var EndNode = require('./end-node');

var Arrow = require('./arrow');

var ImgGrid = require("../images/grid.gif");

//const SimpleNode = require('./simple-node');
//const MergeNode = require('./merge-node');
//const BranchNode = require('./branch-node');
//const SyncNode = require('./sync-node');

var NodeTable = {
	"start-node": StartNode,
	"end-node": EndNode
};

var Node = function (_React$Component) {
	_inherits(Node, _React$Component);

	function Node() {
		_classCallCheck(this, Node);

		return _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).apply(this, arguments));
	}

	_createClass(Node, [{
		key: 'render',
		value: function render() {
			var _props = this.props,
			    type = _props.type,
			    others = _objectWithoutProperties(_props, ['type']);

			return React.createElement(NodeTable[type], _extends({}, others), null);
		}
	}]);

	return Node;
}(React.Component);

var WorkFlow = function (_React$Component2) {
	_inherits(WorkFlow, _React$Component2);

	function WorkFlow(props) {
		_classCallCheck(this, WorkFlow);

		var _this2 = _possibleConstructorReturn(this, (WorkFlow.__proto__ || Object.getPrototypeOf(WorkFlow)).call(this, props));

		_this2.state = _extends({}, props);
		_this2.state.loaded = false;
		return _this2;
	}

	_createClass(WorkFlow, [{
		key: 'handleChange',
		value: function handleChange(e, type, data) {}
	}, {
		key: 'render',
		value: function render() {
			var _state = this.state,
			    width = _state.width,
			    height = _state.height,
			    arrows = _state.arrows,
			    nodes = _state.nodes;

			var handleChange = this.handleChange.bind(this);
			var style = { backgroundImage: "url(" + ImgGrid + ")", width: width, height: height, border: "3px solid #000" };
			return React.createElement(
				Paper,
				{ width: width, height: height, container: { style: style } },
				arrows.map(function (ele, pos) {
					return React.createElement(Arrow, _extends({ key: ele.last + "->" + ele.next }, ele));
				}),
				nodes.map(function (ele, pos) {
					return React.createElement(Node, _extends({ key: ele.type + "->" + ele.id }, ele, { onChange: handleChange }));
				})
			);
		}
	}]);

	return WorkFlow;
}(React.Component);

WorkFlow.propTypes = {
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	arrows: React.PropTypes.array,
	nodes: React.PropTypes.array
};

WorkFlow.defaultProps = {
	width: 600,
	height: 400,
	arrows: [{ last: "start", next: "end", x1: 70, y1: 60, x2: 70, y2: 320 }],
	nodes: [{ type: "start-node", position: { x: 20, y: 20 }, width: 100, height: 40, r: 20, text: "Start", id: "start" }, { type: "end-node", position: { x: 20, y: 320 }, width: 100, height: 40, r: 20, text: "End", id: "end" }]
};

module.exports = WorkFlow;