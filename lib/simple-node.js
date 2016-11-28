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

var SimpleNode = function (_React$Component) {
	_inherits(SimpleNode, _React$Component);

	function SimpleNode(props) {
		_classCallCheck(this, SimpleNode);

		var _this = _possibleConstructorReturn(this, (SimpleNode.__proto__ || Object.getPrototypeOf(SimpleNode)).call(this, props));

		_this.state = {
			loaded: false
		};
		return _this;
	}

	_createClass(SimpleNode, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.handleMove = this.handleMove.bind(this);
			this.handleStart = this.handleStart.bind(this);
			this.handleEnd = this.handleEnd.bind(this);
			this.handleClick = this.handleClick.bind(this);
			this.setState({
				loaded: true
			});
			console.log("didmount");
			if (this.props.onChange) {
				var id = this.props.id;

				this.props.onChange(null, id, {
					key: "loaded",
					value: true
				});
			}
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			if (this.drag) return false;
			if (nextProps.update == "node" || nextProps.update == null) return true;else return false;
			return true;
		}
	}, {
		key: 'handleMove',
		value: function handleMove(dx, dy, x, y, e) {
			if (!this.drag) return;
			if (this.props.onChange) {
				var _props = this.props,
				    id = _props.id,
				    width = _props.width,
				    height = _props.height;

				var position = {
					x: this.xx + dx + this.dx,
					y: this.yy + dy + this.dy
				};
				this.props.onChange(e, id, {
					key: "position",
					value: position
				});
				var rect = this.refs.rect.getElement();
				var text = this.refs.text.getElement();
				var select = this.refs.select.getElement();
				rect.attr(position);
				text.attr({
					x: position.x + width / 2,
					y: position.y + height / 2
				});
				select.attr({
					x: position.x - 1,
					y: position.y - 1
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
		key: 'handleClick',
		value: function handleClick(e) {
			if (this.drag) return;
			var _props2 = this.props,
			    selectId = _props2.selectId,
			    id = _props2.id;

			var selected = id == selectId;
			if (this.props.onChange) {
				this.props.onChange(e, id, {
					key: "selectId",
					value: selected ? null : id
				});
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _props3 = this.props,
			    width = _props3.width,
			    height = _props3.height,
			    position = _props3.position,
			    r = _props3.r,
			    text = _props3.text,
			    selectId = _props3.selectId,
			    id = _props3.id;

			if (this.drag) {
				position = this.state.position;
			}
			var center = {
				x: position.x + width / 2,
				y: position.y + height / 2
			};

			return React.createElement(
				Set,
				null,
				React.createElement(Rect, { ref: 'select', width: width + 2, height: height + 2, x: position.x - 1, y: position.y - 1, attr: { "stroke": "red", "stroke-width": 2, "stroke-dasharray": "- " }, hide: id != selectId }),
				React.createElement(Rect, { ref: 'rect', width: width, height: height, x: position.x, y: position.y, r: r, attr: { "fill": "#fff" },
					drag: { move: this.handleMove, start: this.handleStart, end: this.handleEnd }, click: this.handleClick
				}),
				React.createElement(Text, { ref: 'text', x: center.x, y: center.y, text: text })
			);
		}
	}]);

	return SimpleNode;
}(React.Component);

module.exports = SimpleNode;