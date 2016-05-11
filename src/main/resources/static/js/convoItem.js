"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ConvoItem = (function (_super) {
    __extends(ConvoItem, _super);
    function ConvoItem() {
        _super.call(this);
    }
    ConvoItem.prototype.componentDidMount = function () {
        componentHandler.upgradeDom();
    };
    ConvoItem.prototype.componentDidUpdate = function (prevProps, prevState, prevContext) {
        componentHandler.upgradeDom();
    };
    ConvoItem.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {className: "mdl-list__item ios-tappable", onClick: function (e) { return _this.onSelect(e); }}, 
            React.createElement("span", {className: "mdl-list__item-primary-content"}, 
                React.createElement("i", {className: "material-icons mdl-list__item-avatar"}, "chat"), 
                React.createElement("span", null, this.props.usernames.join(", "))), 
            React.createElement("a", {className: "mdl-list__item-secondary-action", onClick: function (e) { return _this.onDelete(e); }}, 
                React.createElement("i", {className: "material-icons"}, "delete")
            )));
    };
    ConvoItem.prototype.onSelect = function (event) {
        event.preventDefault();
        this.props.onSelect();
    };
    ConvoItem.prototype.onDelete = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onDestroy();
    };
    return ConvoItem;
}(React.Component));
exports.ConvoItem = ConvoItem;
