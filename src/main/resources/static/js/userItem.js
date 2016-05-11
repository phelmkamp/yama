"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UserItem = (function (_super) {
    __extends(UserItem, _super);
    function UserItem(props) {
        _super.call(this, props);
    }
    UserItem.prototype.componentDidMount = function () {
        componentHandler.upgradeDom();
    };
    UserItem.prototype.componentDidUpdate = function (prevProps, prevState, prevContext) {
        componentHandler.upgradeDom();
    };
    UserItem.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {className: "mdl-list__item ios-tappable", onClick: function (e) { return _this.handleSelect(e); }}, 
            React.createElement("span", {className: "mdl-list__item-primary-content"}, 
                this.getIcon(), 
                React.createElement("span", null, this.props.user.displayName))
        ));
    };
    UserItem.prototype.getIcon = function () {
        if (this.props.user.iconUrl) {
            return (React.createElement("img", {className: "material-icons mdl-list__item-avatar", src: this.props.user.iconUrl}));
        }
        else {
            return (React.createElement("i", {className: "material-icons mdl-list__item-avatar"}, "person"));
        }
    };
    UserItem.prototype.handleSelect = function (event) {
        event.preventDefault();
        this.props.onSelect();
    };
    return UserItem;
}(React.Component));
exports.UserItem = UserItem;
