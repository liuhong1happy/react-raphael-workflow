'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('../less/style.less');
var React = require('react');
var ReactDOM = require('react-dom');

var _require = require('react-raphael'),
    Paper = _require.Paper;

var StartNode = require('./start-node');
var EndNode = require('./end-node');

var Arrow = require('./arrow');

var ImgGrid = require("../images/grid.gif");

var SimpleNode = require('./simple-node');
//const MergeNode = require('./merge-node');
//const BranchNode = require('./branch-node');
//const SyncNode = require('./sync-node');

var NodeTable = {
    "start-node": SimpleNode,
    "end-node": SimpleNode,
    "simple-node": SimpleNode
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
        _this2.state.update = null;
        return _this2;
    }

    _createClass(WorkFlow, [{
        key: 'getNodeById',
        value: function getNodeById(id) {
            var nodes = this.state.nodes;
            var finds = nodes.filter(function (ele) {
                return ele.id == id;
            });
            return finds[0] || {};
        }
    }, {
        key: 'getLastArrowsByNodeId',
        value: function getLastArrowsByNodeId(id) {
            var arrows = this.state.arrows;
            var finds = arrows.filter(function (ele) {
                return ele.next == id;
            });
            return finds;
        }
    }, {
        key: 'getNextArrowsByNodeId',
        value: function getNextArrowsByNodeId(id) {
            var arrows = this.state.arrows;
            var finds = arrows.filter(function (ele) {
                return ele.last == id;
            });
            return finds;
        }
    }, {
        key: 'updateNodeAndArrow',
        value: function updateNodeAndArrow(lastNode, arrow, nextNode) {
            var point = this.getStartEnd(lastNode, nextNode);
            arrow.x1 = point.start.x;
            arrow.y1 = point.start.y;
            arrow.x2 = point.end.x;
            arrow.y2 = point.end.y;
            var arrows = this.state.arrows;
            var finds = arrows.filter(function (ele) {
                return ele.id == arrow.id;
            });
            finds[0] = arrow;
            this.setState({
                arrows: arrows,
                update: "arrow"
            });
        }
    }, {
        key: 'getStartEnd',
        value: function getStartEnd(lastNode, nextNode) {
            var bb1 = { x: lastNode.position.x, y: lastNode.position.y, width: lastNode.width, height: lastNode.height };
            var bb2 = { x: nextNode.position.x, y: nextNode.position.y, width: nextNode.width, height: nextNode.height };
            var p = [{ x: bb1.x + bb1.width / 2, y: bb1.y - 1 }, { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 }, { x: bb1.x - 1, y: bb1.y + bb1.height / 2 }, { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 }, { x: bb2.x + bb2.width / 2, y: bb2.y - 1 }, { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 }, { x: bb2.x - 1, y: bb2.y + bb2.height / 2 }, { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }];
            var d = {},
                dis = [];
            for (var i = 0; i < 4; i++) {
                for (var j = 4; j < 8; j++) {
                    var dx = Math.abs(p[i].x - p[j].x),
                        dy = Math.abs(p[i].y - p[j].y);
                    if (i == j - 4 || (i != 3 && j != 6 || p[i].x < p[j].x) && (i != 2 && j != 7 || p[i].x > p[j].x) && (i != 0 && j != 5 || p[i].y > p[j].y) && (i != 1 && j != 4 || p[i].y < p[j].y)) {
                        dis.push(dx + dy);
                        d[dis[dis.length - 1]] = [i, j];
                    }
                }
            }
            if (dis.length == 0) {
                var res = [0, 4];
            } else {
                res = d[Math.min.apply(Math, dis)];
            }
            var result = {};
            result.start = {};
            result.end = {};
            result.start.x = p[res[0]].x;
            result.start.y = p[res[0]].y;
            result.end.x = p[res[1]].x;
            result.end.y = p[res[1]].y;
            return result;
        }
    }, {
        key: 'handleChange',
        value: function handleChange(e, id, data) {
            var key = data.key;
            var value = data.value;
            var node = this.getNodeById(id);
            node[key] = value;
            if (key == "position") {
                switch (node.type) {
                    case "start-node":
                        var nextArrow = this.getNextArrowsByNodeId(id)[0] || {};
                        var nextNode = this.getNodeById(nextArrow.next);
                        this.updateNodeAndArrow(node, nextArrow, nextNode);
                        break;
                    case "end-node":
                        var lastArrow = this.getLastArrowsByNodeId(id)[0] || {};
                        var lastNode = this.getNodeById(lastArrow.last);
                        this.updateNodeAndArrow(lastNode, lastArrow, node);
                        break;
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                width = _state.width,
                height = _state.height,
                arrows = _state.arrows,
                nodes = _state.nodes,
                update = _state.update;

            var handleChange = this.handleChange.bind(this);
            var style = { backgroundImage: "url(" + ImgGrid + ")", width: width, height: height, border: "3px solid #000" };
            return React.createElement(
                Paper,
                { width: width, height: height, container: { style: style } },
                arrows.map(function (ele, pos) {
                    return React.createElement(Arrow, _extends({ key: ele.last + "->" + ele.next }, ele, { update: update }));
                }),
                nodes.map(function (ele, pos) {
                    return React.createElement(Node, _extends({ key: ele.type + "->" + ele.id }, ele, { update: update, onChange: handleChange }));
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
    arrows: [{ id: "default-arrow", last: "start", next: "end", x1: 70, y1: 60, x2: 70, y2: 320 }],
    nodes: [{ type: "start-node", position: { x: 20, y: 20 }, width: 100, height: 40, r: 20, text: "Start", id: "start" }, { type: "end-node", position: { x: 20, y: 320 }, width: 100, height: 40, r: 20, text: "End", id: "end" }]
};

module.exports = WorkFlow;