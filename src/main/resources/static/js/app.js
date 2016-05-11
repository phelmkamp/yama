"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var constants_1 = require("./constants");
var userModel_1 = require("./userModel");
var usersView_1 = require("./usersView");
var convoModel_1 = require("./convoModel");
var convosView_1 = require("./convosView");
var chatView_1 = require("./chatView");
var utils_1 = require("./utils");
var MainView = (function (_super) {
    __extends(MainView, _super);
    function MainView(props) {
        _super.call(this);
        this.userModel = new userModel_1.UserModel('yama-users', props.thisUser, props.stompClient);
        this.userModel.subscribe(this.onUserModelChanged.bind(this));
        this.state = { activeView: constants_1.View.Convos };
        this.convoModel = new convoModel_1.ConvoModel('yama-convos', props.stompClient);
        this.convoModel.subscribe(this.onConvoModelChanged.bind(this));
    }
    MainView.prototype.componentDidUpdate = function (prevProps, prevState, prevContext) {
        componentHandler.upgradeDom();
    };
    MainView.prototype.render = function () {
        switch (this.state.activeView) {
            case constants_1.View.Users:
                return this.renderUsers();
            case constants_1.View.Chat:
                return this.renderChat();
            default:
                return this.renderConvos();
        }
    };
    MainView.prototype.renderConvos = function () {
        var _this = this;
        return (React.createElement(convosView_1.ConvosView, {thisUser: utils_1.Utils.extend(this.props.thisUser), convoModel: this.convoModel, onNewConvoButton: function () { _this.setState({ activeView: constants_1.View.Users }); }, onSelectConvo: function (convo) { _this.setState({ activeView: constants_1.View.Chat, activeConvo: convo }); }, stompClient: this.props.stompClient, csrf: this.props.csrf}));
    };
    MainView.prototype.renderUsers = function () {
        var _this = this;
        return (React.createElement(usersView_1.UsersView, {thisUser: utils_1.Utils.extend(this.props.thisUser), userModel: this.userModel, onUsersSelected: function (users) { return _this.onUsersSelected(users); }, onBack: function () { return _this.setState({ activeView: constants_1.View.Convos }); }, csrf: this.props.csrf}));
    };
    MainView.prototype.renderChat = function () {
        var _this = this;
        return (React.createElement(chatView_1.ChatView, {thisUser: utils_1.Utils.extend(this.props.thisUser), convo: this.state.activeConvo, onBack: function () { return _this.setState({ activeView: constants_1.View.Convos }); }, csrf: this.props.csrf, stompClient: this.props.stompClient}));
    };
    MainView.prototype.onUsersSelected = function (users) {
        var copy = users.map(function (u) {
            return utils_1.Utils.extend(u);
        });
        copy.push(utils_1.Utils.extend(this.props.thisUser));
        var convo = this.convoModel.add(copy);
        this.setState({ activeView: constants_1.View.Convos });
    };
    MainView.prototype.onConvoModelChanged = function () {
        this.forceUpdate();
    };
    MainView.prototype.onUserModelChanged = function () {
        if (!this.props.thisUser.session) {
            var user = this.userModel.find(this.props.thisUser.name);
            if (user) {
                this.props.thisUser = utils_1.Utils.extend(user);
            }
        }
        else {
            this.forceUpdate();
        }
    };
    return MainView;
}(React.Component));
var request = new XMLHttpRequest();
request.onload = connect;
request.open("GET", "/csrf", true);
request.send();
var stompClient;
var csrf;
function connect() {
    var socket = new SockJS('/yama');
    stompClient = Stomp.over(socket);
    csrf = JSON.parse(request.responseText);
    var headers = {};
    headers[csrf.headerName] = csrf.token;
    stompClient.connect(headers, onConnect);
}
function onConnect(frame) {
    var thisUsername = frame.headers['user-name'];
    var thisUser = { name: thisUsername, session: null,
        displayName: "you", iconUrl: null };
    React.render(React.createElement(MainView, {stompClient: stompClient, thisUser: thisUser, csrf: csrf}), document.getElementsByClassName('main')[0]);
}
