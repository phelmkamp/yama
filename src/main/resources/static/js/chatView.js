"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ChatView = (function (_super) {
    __extends(ChatView, _super);
    function ChatView(props) {
        _super.call(this);
    }
    ChatView.prototype.componentDidMount = function () {
        componentHandler.upgradeDom();
    };
    ChatView.prototype.componentDidUpdate = function (prevProps, prevState, prevContext) {
        componentHandler.upgradeDom();
    };
    ChatView.prototype.render = function () {
        var _this = this;
        var usernames = [];
        for (var _i = 0, _a = this.props.convo.users; _i < _a.length; _i++) {
            var u = _a[_i];
            if (u.name !== this.props.thisUser.name) {
                usernames.push(u.displayName);
            }
        }
        return (React.createElement("div", {className: "mdl-layout mdl-js-layout mdl-layout--fixed-header"}, 
            React.createElement("header", {className: "mdl-layout__header"}, 
                React.createElement("button", {className: "mdl-layout-icon mdl-button mdl-js-button mdl-button--icon", onClick: function (e) { return _this.onBackButton(e); }}, 
                    React.createElement("i", {className: "material-icons"}, "arrow_back")
                ), 
                React.createElement("div", {className: "mdl-layout__header-row"}, 
                    React.createElement("span", {className: "mdl-layout-title"}, usernames.join(", ")), 
                    React.createElement("div", {className: "mdl-layout-spacer"}), 
                    React.createElement("nav", {className: "mdl-navigation mdl-layout--large-screen-only"}, 
                        React.createElement("a", {className: "mdl-navigation__link", href: "", onClick: function (e) { return _this.onLogout(e); }}, "logout"), 
                        React.createElement("form", {id: "logout", action: "/logout", method: "post"}, 
                            React.createElement("input", {type: "hidden", name: this.props.csrf.parameterName, value: this.props.csrf.token})
                        )))), 
            React.createElement("main", {className: "mdl-layout__content"}, 
                React.createElement("div", {className: "mdl-grid"}, 
                    React.createElement("div", {className: "mdl-cell mdl-cell--12-col"}, 
                        React.createElement("h4", null, usernames[0]), 
                        React.createElement("p", {ref: "response2"}, this.getContent())), 
                    React.createElement("div", {className: "mdl-cell mdl-cell--12-col"}, 
                        React.createElement("form", {action: "#"}, 
                            React.createElement("div", {className: "mdl-textfield mdl-js-textfield mdl-textfield--floating-label full-width"}, 
                                React.createElement("label", {htmlFor: "newField", className: "mdl-textfield__label"}, "you"), 
                                React.createElement("textarea", {type: "text", className: "mdl-textfield__input", id: "newField", ref: "newField", onKeyUp: function (e) { return _this.onType(e); }, autoFocus: true, rows: 5}, this.props.convo.content[this.props.thisUser.name]))
                        )
                    ))
            )));
    };
    ChatView.prototype.getContent = function () {
        var content = '';
        for (var user in this.props.convo.content) {
            if (user !== this.props.thisUser.name) {
                content = this.props.convo.content[user];
                break;
            }
        }
        return content;
    };
    ChatView.prototype.onType = function (event) {
        var val = React.findDOMNode(this.refs["newField"]).value.trim();
        this.props.convo.content[this.props.thisUser.name] = val;
        this.props.stompClient.send("/app/convos/" + this.props.convo.id, {}, JSON.stringify(this.props.convo));
    };
    ChatView.prototype.onBackButton = function (event) {
        event.preventDefault();
        this.props.onBack();
    };
    ChatView.prototype.onLogout = function (event) {
        event.preventDefault();
        event.stopPropagation();
        var form = document.getElementById('logout');
        form.submit();
    };
    return ChatView;
}(React.Component));
exports.ChatView = ChatView;
