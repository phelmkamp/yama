"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var convoModel_1 = require("./convoModel");
var convoItem_1 = require("./convoItem");
var userModel_1 = require("./userModel");
var userItem_1 = require("./userItem");
var TodoApp = (function (_super) {
    __extends(TodoApp, _super);
    function TodoApp(props) {
        _super.call(this, props);
        this.state = {
            editing: null
        };
    }
    TodoApp.prototype.componentDidMount = function () {
        var setState = this.setState;
        this.connect();
    };
    TodoApp.prototype.connect = function () {
        this.props.stompClient.connect({}, this.onConnect.bind(this));
    };
    TodoApp.prototype.onConnect = function (frame) {
        user = frame.headers['user-name'];
        var userTopic = "/topic/users/" + user;
        this.props.stompClient.subscribe(userTopic + '/allUsers', this.onAllUsers.bind(this), {});
        this.props.stompClient.send("/app/honiara/newUsers", {}, null);
        this.props.stompClient.subscribe('/topic/newUsers', this.onUserJoin.bind(this), {});
        this.props.stompClient.subscribe('/topic/exitingUsers', this.onUserLeft.bind(this), {});
        this.props.stompClient.subscribe(userTopic + '/newConvos', this.onConvoAdded.bind(this), {});
    };
    TodoApp.prototype.onMessage = function (message) {
        var messageBody = JSON.parse(message.body);
        if (messageBody.sender != user) {
            var response2 = React.findDOMNode(this.refs["response2"]);
            response2.innerHTML = messageBody.content;
        }
    };
    TodoApp.prototype.onConvoAdded = function (message) {
        var messageBody = JSON.parse(message.body);
        this.props.model.addConvo(messageBody);
        this.props.stompClient.subscribe('/topic/convos/' + messageBody.id, this.onMessage.bind(this), {});
    };
    TodoApp.prototype.onUserLeft = function (message) {
        var messageBody = JSON.parse(message.body);
        userModel.destroy(messageBody.user);
    };
    TodoApp.prototype.onAllUsers = function (message) {
        var messageBody = JSON.parse(message.body);
        userModel.setUsers(messageBody.allUsers);
    };
    TodoApp.prototype.onUserJoin = function (message) {
        var messageBody = JSON.parse(message.body);
        userModel.setUsers([messageBody]);
        this.props.stompClient.send("/app/honiara/users/" + messageBody.id + "/allUsers", {}, JSON.stringify({ 'allUsers': userModel.users }));
    };
    TodoApp.prototype.handleNewTodoKeyDown = function (event) {
        event.preventDefault();
        var val = React.findDOMNode(this.refs["newField"]).value.trim();
        this.props.stompClient.send("/app/honiara/convos/" + this.state.editing, {}, JSON.stringify({ 'content': val }));
    };
    TodoApp.prototype.destroy = function (convo) {
        this.props.model.destroy(convo);
    };
    TodoApp.prototype.change = function (convo) {
        this.setState({ editing: convo.id });
        console.log("editing: " + JSON.stringify(convo));
    };
    TodoApp.prototype.save = function (convoToSave) {
        this.props.model.save(convoToSave);
    };
    TodoApp.prototype.render = function () {
        var _this = this;
        var footer;
        var main;
        var convos = this.props.model.convos;
        var convoItems = convos.map(function (convo) {
            return (React.createElement(convoItem_1.ConvoItem, {key: convo.id, convo: convo, onDestroy: _this.destroy.bind(_this, convo), active: _this.state.editing === convo.id, onSave: _this.save.bind(_this, convo), onChange: _this.change.bind(_this, convo)}));
        });
        footer = (React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-12"}, React.createElement("footer", null, React.createElement("p", null, "© copyright 2016 phil helmkamp")))));
        main = (React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-4"}, React.createElement("div", {className: "row"}, React.createElement("button", {type: "button", className: "btn btn-default btn-sm pull-right", "data-toggle": "modal", "data-target": "#userDialog"}, React.createElement("span", {className: "glyphicon glyphicon-asterisk"}))), React.createElement("div", {className: "row"}, React.createElement("div", {className: "list-group"}, convoItems))), React.createElement("div", {className: "form-group col-xs-4"}, React.createElement("label", null, "you"), React.createElement("textarea", {type: "text", className: "form-control", ref: "newField", placeholder: "chat here", onKeyUp: function (e) { return _this.handleNewTodoKeyDown(e); }, autoFocus: true, rows: 5})), React.createElement("div", {className: "col-xs-4"}, React.createElement("label", null, "friend"), React.createElement("p", {ref: "response2", className: "text-primary"}))));
        return (React.createElement("div", {className: "container"}, main, React.createElement("hr", null), footer));
    };
    return TodoApp;
}(React.Component));
var Users = (function (_super) {
    __extends(Users, _super);
    function Users(props) {
        _super.call(this, props);
        this.state = {
            editing: null
        };
    }
    Users.prototype.componentDidMount = function () {
        var setState = this.setState;
    };
    Users.prototype.change = function (selectedUser) {
        var convo = { id: null, users: [{ id: user }, { id: selectedUser.id }] };
        this.props.stompClient.send("/app/honiara/newConvos", {}, JSON.stringify(convo));
    };
    Users.prototype.render = function () {
        var _this = this;
        var main;
        var users = this.props.model.users;
        var userItems = users.map(function (user) {
            return (React.createElement(userItem_1.UserItem, {user: user, onChange: _this.change.bind(_this, user)}));
        });
        return (React.createElement("div", {className: "list-group"}, userItems));
    };
    return Users;
}(React.Component));
var model = new convoModel_1.ConvoModel('convos');
var userModel = new userModel_1.UserModel('users');
var socket = new SockJS('/honiara');
var stompClient = Stomp.over(socket);
var user = null;
function render() {
    React.render(React.createElement(TodoApp, {model: model, stompClient: stompClient, user: null}), document.getElementsByClassName('todoapp')[0]);
}
function renderUsers() {
    React.render(React.createElement(Users, {model: userModel, stompClient: stompClient, user: null}), document.getElementsByClassName('usersview')[0]);
}
model.subscribe(render);
userModel.subscribe(renderUsers);
render();
renderUsers();
