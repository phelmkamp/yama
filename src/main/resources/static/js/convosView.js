"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var convoItem_1 = require("./convoItem");
var ConvosView = (function (_super) {
    __extends(ConvosView, _super);
    function ConvosView(props) {
        _super.call(this);
    }
    ConvosView.prototype.componentDidMount = function () {
        componentHandler.upgradeDom();
    };
    ConvosView.prototype.componentDidUpdate = function (prevProps, prevState, prevContext) {
        componentHandler.upgradeDom();
    };
    ConvosView.prototype.render = function () {
        var _this = this;
        var convos = this.props.convoModel.convos;
        var convoPane;
        if (convos.length > 0) {
            var convoItems = convos.map(function (convo) {
                var usernames = convo.users
                    .filter(function (u) {
                    return u.name !== _this.props.thisUser.name;
                })
                    .map(function (u) {
                    return u.displayName;
                });
                return (React.createElement(convoItem_1.ConvoItem, {usernames: usernames, onDestroy: _this.onDeleteConvoAction.bind(_this, convo), onSelect: _this.onSelectConvoAction.bind(_this, convo)}));
            });
            convoPane = (React.createElement("div", {className: "mdl-list"}, convoItems));
        }
        else {
            convoPane = (React.createElement("div", {className: "mdl-grid"}, 
                React.createElement("div", {className: "mdl-cell mdl-cell--12-col"}, 
                    React.createElement("h4", null, "no active conversations")
                )
            ));
        }
        return (React.createElement("div", {className: "mdl-layout mdl-js-layout mdl-layout--fixed-header"}, 
            React.createElement("header", {className: "mdl-layout__header"}, 
                React.createElement("div", {className: "mdl-layout__header-row"}, 
                    React.createElement("span", {className: "mdl-layout-title"}, "conversations"), 
                    React.createElement("div", {className: "mdl-layout-spacer"}), 
                    React.createElement("nav", {className: "mdl-navigation mdl-layout--large-screen-only"}, 
                        React.createElement("a", {className: "mdl-navigation__link", href: "", onClick: function (e) { return _this.onLogout(e); }}, "logout")
                    ))
            ), 
            React.createElement("div", {className: "mdl-layout__drawer"}, 
                React.createElement("span", {className: "mdl-layout-title"}, "yama"), 
                React.createElement("nav", {className: "mdl-navigation"}, 
                    React.createElement("a", {className: "mdl-navigation__link", href: "", onClick: function (e) { return _this.onLogout(e); }}, "logout")
                )), 
            convoPane, 
            React.createElement("main", {className: "mdl-layout__content"}, 
                React.createElement("button", {type: "button", onClick: function (e) { return _this.onNewConvoButton(e); }, className: classNames("mdl-button", "mdl-js-button", "mdl-button--fab", "mdl-js-ripple-effect", "mdl-button--colored", "floating-fab")}, 
                    React.createElement("i", {className: "material-icons"}, "add")
                )
            ), 
            React.createElement("form", {id: "logout", action: "/logout", method: "post", type: "hidden"}, 
                React.createElement("input", {type: "hidden", name: this.props.csrf.parameterName, value: this.props.csrf.token})
            )));
    };
    ConvosView.prototype.onNewConvoButton = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onNewConvoButton();
    };
    ConvosView.prototype.onDeleteConvoAction = function (convo) {
        this.props.convoModel.remove(convo);
    };
    ConvosView.prototype.onSelectConvoAction = function (convo) {
        this.props.onSelectConvo(convo);
    };
    ConvosView.prototype.onLogout = function (event) {
        event.preventDefault();
        event.stopPropagation();
        var form = document.getElementById('logout');
        form.submit();
    };
    return ConvosView;
}(React.Component));
exports.ConvosView = ConvosView;
