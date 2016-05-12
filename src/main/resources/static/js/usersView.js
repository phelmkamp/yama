"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var userItem_1 = require("./userItem");
var UsersView = (function (_super) {
    __extends(UsersView, _super);
    function UsersView(props) {
        _super.call(this);
    }
    UsersView.prototype.componentDidMount = function () {
        componentHandler.upgradeDom();
    };
    UsersView.prototype.componentDidUpdate = function () {
        componentHandler.upgradeDom();
    };
    UsersView.prototype.render = function () {
        var _this = this;
        var users = this.props.userModel.users.filter(function (user) {
            return user.name !== _this.props.thisUser.name;
        });
        var userPane;
        if (users.length > 0) {
            var userItems = users.map(function (user) {
                return (React.createElement(userItem_1.UserItem, {user: user, onSelect: _this.onUserSelect.bind(_this, user)}));
            });
            userPane = (React.createElement("div", {className: "mdl-list"}, userItems));
        }
        else {
            userPane = (React.createElement("div", {className: "mdl-grid"}, 
                React.createElement("div", {className: "mdl-cell mdl-cell--12-col mdl-typography--text-center"}, 
                    React.createElement("h4", null, "no other users are online at this time :(")
                )
            ));
        }
        return (React.createElement("div", {className: "mdl-layout mdl-js-layout mdl-layout--fixed-header"}, 
            React.createElement("header", {className: "mdl-layout__header"}, 
                React.createElement("button", {className: "mdl-layout-icon mdl-button mdl-js-button mdl-button--icon", onClick: function (e) { return _this.onBackButton(e); }}, 
                    React.createElement("i", {className: "material-icons"}, "arrow_back")
                ), 
                React.createElement("div", {className: "mdl-layout__header-row"}, 
                    React.createElement("span", {className: "mdl-layout-title"}, "users"), 
                    React.createElement("div", {className: "mdl-layout-spacer"}), 
                    React.createElement("nav", {className: "mdl-navigation mdl-layout--large-screen-only"}, 
                        React.createElement("a", {className: "mdl-navigation__link", href: "", onClick: function (e) { return _this.onLogout(e); }}, "logout"), 
                        React.createElement("form", {id: "logout", action: "/logout", method: "post"}, 
                            React.createElement("input", {type: "hidden", name: this.props.csrf.parameterName, value: this.props.csrf.token})
                        )))), 
            React.createElement("main", {className: "mdl-layout__content"}, userPane)));
    };
    UsersView.prototype.onUserModelChanged = function () {
        this.setState({});
    };
    UsersView.prototype.onUserSelect = function (user) {
        this.props.onUsersSelected([user]);
    };
    UsersView.prototype.onBackButton = function (event) {
        event.preventDefault();
        this.props.onBack();
    };
    UsersView.prototype.onLogout = function (event) {
        event.preventDefault();
        event.stopPropagation();
        var form = document.getElementById('logout');
        form.submit();
    };
    return UsersView;
}(React.Component));
exports.UsersView = UsersView;
