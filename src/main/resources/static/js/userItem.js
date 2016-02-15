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
        this.state = { title: this.props.user.id };
    }
    UserItem.prototype.handleChange = function (event) {
        event.preventDefault();
        this.props.onChange();
    };
    UserItem.prototype.render = function () {
        var _this = this;
        return (React.createElement("a", {href: "#", className: "list-group-item", onClick: function (e) { return _this.handleChange(e); }, "data-dismiss": "modal"}, this.state.title));
    };
    return UserItem;
}(React.Component));
exports.UserItem = UserItem;
