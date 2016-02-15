"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ConvoItem = (function (_super) {
    __extends(ConvoItem, _super);
    function ConvoItem(props) {
        _super.call(this, props);
        this.state = { title: this.buildTitle(this.props.convo) };
    }
    ConvoItem.prototype.buildTitle = function (convo) {
        var text = convo.users.reduce(function (title, user) {
            return title += user.id + ", ";
        }, "");
        return text.substring(0, text.length - 2);
    };
    ConvoItem.prototype.getActiveText = function () {
        var activeText = this.props.active ? "active" : "";
        return activeText;
    };
    ConvoItem.prototype.handleChange = function (event) {
        event.preventDefault();
        this.props.onChange();
    };
    ConvoItem.prototype.handleDeleteButton = function (event) {
        event.preventDefault();
        this.props.onDestroy();
    };
    ConvoItem.prototype.render = function () {
        var _this = this;
        return (React.createElement("a", {href: "#", className: "list-group-item", onClick: function (e) { return _this.handleChange(e); }}, this.state.title, React.createElement("div", {className: "btn-group pull-right", role: "group"}, React.createElement("button", {type: "button", className: "btn btn-danger btn-xs", onClick: function (e) { return _this.handleDeleteButton(e); }}, React.createElement("span", {className: "glyphicon glyphicon-trash"})))));
    };
    return ConvoItem;
}(React.Component));
exports.ConvoItem = ConvoItem;
