'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var _require = require('react-raphael'),
    Set = _require.Set,
    Rect = _require.Rect,
    Text = _require.Text;

var StartNode = function (_React$Component) {
	_inherits(StartNode, _React$Component);

	function StartNode(props) {
		_classCallCheck(this, StartNode);

		var _this = _possibleConstructorReturn(this, (StartNode.__proto__ || Object.getPrototypeOf(StartNode)).call(this, props));

		_this.state = {
			loaded: false
		};
		return _this;
	}

	_createClass(StartNode, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.handleMove = this.handleMove.bind(this);
			this.handleStart = this.handleStart.bind(this);
			this.handleEnd = this.handleEnd.bind(this);
			this.setState({
				loaded: true
			});
			if (this.props.onChange) {
				var id = this.props.id;

				this.props.onChange(null, id, {
					key: "loaded",
					value: true
				});
			}
		}
	}, {
		key: 'handleMove',
		value: function handleMove(dx, dy, x, y, e) {
			if (!this.drag) return;
			if (this.props.onChange) {
				var _props = this.props,
				    id = _props.id,
				    position = _props.position;

				this.props.onChange(e, id, {
					key: "position",
					value: {
						x: position.x + dx,
						y: position.y + dy
					}
				});
				var rect = this.refs.rect.getElement();
				rect.attr({
					x: this.xx + dx + this.dx,
					y: this.yy + dy + this.dy
				});
			}
			this.drag = true;
		}
	}, {
		key: 'handleStart',
		value: function handleStart(x, y, e) {
			this.drag = true;
			var rect = this.refs.rect.getElement();
			var rx = rect.attr("x");
			var ry = rect.attr("y");
			this.xx = x;
			this.yy = y;
			this.dx = rx - x;
			this.dy = ry - y;
		}
	}, {
		key: 'handleEnd',
		value: function handleEnd(e) {
			this.drag = false;
		}
	}, {
		key: 'render',
		value: function render() {
			var _props2 = this.props,
			    width = _props2.width,
			    height = _props2.height,
			    position = _props2.position,
			    r = _props2.r,
			    text = _props2.text;

			if (this.drag) {
				position = this.state.position;
				console.log(position);
			}
			var center = {
				x: position.x + width / 2,
				y: position.y + height / 2
			};
			return React.createElement(
				Set,
				null,
				React.createElement(Rect, { ref: 'rect', width: width, height: height, x: position.x, y: position.y, r: r, attr: { "fill": "#fff" },
					drag: { move: this.handleMove, start: this.handleStart, end: this.handleEnd }
				}),
				React.createElement(Text, { x: center.x, y: center.y, text: text })
			);
		}
	}]);

	return StartNode;
}(React.Component);

module.exports = StartNode;