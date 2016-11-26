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

var EndNode = function (_React$Component) {
	_inherits(EndNode, _React$Component);

	function EndNode() {
		_classCallCheck(this, EndNode);

		return _possibleConstructorReturn(this, (EndNode.__proto__ || Object.getPrototypeOf(EndNode)).apply(this, arguments));
	}

	_createClass(EndNode, [{
		key: 'render',
		value: function render() {
			var _props = this.props,
			    width = _props.width,
			    height = _props.height,
			    position = _props.position,
			    r = _props.r,
			    text = _props.text;

			var center = {
				x: position.x + width / 2,
				y: position.y + height / 2
			};
			return React.createElement(
				Set,
				null,
				React.createElement(Rect, { width: width, height: height, x: position.x, y: position.y, r: r, attr: { "fill": "#fff" } }),
				React.createElement(Text, { x: center.x, y: center.y, text: text })
			);
		}
	}]);

	return EndNode;
}(React.Component);

module.exports = EndNode;