(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./convoItem":2,"./convoModel":3,"./userItem":4,"./userModel":5}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";
var utils_1 = require("./utils");
var ConvoModel = (function () {
    function ConvoModel(key) {
        this.key = key;
        this.convos = [];
        this.onChanges = [];
    }
    ConvoModel.prototype.subscribe = function (onChange) {
        this.onChanges.push(onChange);
    };
    ConvoModel.prototype.inform = function () {
        utils_1.Utils.store(this.key, this.convos);
        this.onChanges.forEach(function (cb) { cb(); });
    };
    ConvoModel.prototype.addConvo = function (convo) {
        this.convos = this.convos.concat({
            id: convo.id,
            users: convo.users
        });
        this.inform();
    };
    ConvoModel.prototype.destroy = function (convo) {
        this.convos = this.convos.filter(function (candidate) {
            return candidate !== convo;
        });
        this.inform();
    };
    ConvoModel.prototype.save = function (convoToSave) {
        this.convos = this.convos.map(function (convo) {
            return convo !== convoToSave ? convo : utils_1.Utils.extend({}, convo, { users: convoToSave.users });
        });
        this.inform();
    };
    return ConvoModel;
}());
exports.ConvoModel = ConvoModel;

},{"./utils":6}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
var utils_1 = require("./utils");
var UserModel = (function () {
    function UserModel(key) {
        this.key = key;
        this.users = [];
        this.onChanges = [];
        this.userMap = {};
    }
    UserModel.prototype.subscribe = function (onChange) {
        this.onChanges.push(onChange);
    };
    UserModel.prototype.inform = function () {
        utils_1.Utils.store(this.key, this.users);
        this.onChanges.forEach(function (cb) { cb(); });
    };
    UserModel.prototype.setUsers = function (usersToSet) {
        var users = this.users;
        var userMap = this.userMap;
        usersToSet.forEach(function (u) {
            if (!userMap.hasOwnProperty(u.id)) {
                users.push(u);
                userMap[u.id] = u;
                console.log("added user " + JSON.stringify(u));
            }
        });
        this.inform();
    };
    UserModel.prototype.destroy = function (user) {
        this.users = this.users.filter(function (candidate) {
            return candidate !== user;
        });
        delete this.userMap[user.id];
        console.log("removed user " + JSON.stringify(user));
        this.inform();
    };
    return UserModel;
}());
exports.UserModel = UserModel;

},{"./utils":6}],6:[function(require,module,exports){
"use strict";
var Utils = (function () {
    function Utils() {
    }
    Utils.uuid = function () {
        var i, random;
        var uuid = '';
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
                .toString(16);
        }
        return uuid;
    };
    Utils.pluralize = function (count, word) {
        return count === 1 ? word : word + 's';
    };
    Utils.store = function (namespace, data) {
        if (data) {
            return localStorage.setItem(namespace, JSON.stringify(data));
        }
        var store = localStorage.getItem(namespace);
        return (store && JSON.parse(store)) || [];
    };
    Utils.extend = function () {
        var objs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objs[_i - 0] = arguments[_i];
        }
        var newObj = {};
        for (var i = 0; i < objs.length; i++) {
            var obj = objs[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = obj[key];
                }
            }
        }
        return newObj;
    };
    return Utils;
}());
exports.Utils = Utils;

},{}]},{},[1]);
