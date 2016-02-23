"use strict";
var UserModel = (function () {
    function UserModel(key, thisUser, stompClient) {
        this.key = key;
        this.thisUser = thisUser;
        this.users = [];
        this.userMap = {};
        this.stompClient = stompClient;
        this.onChanges = [];
        var userTopic = "/user";
        this.stompClient.subscribe('/topic/users', this.onAllUsers.bind(this), {});
    }
    UserModel.prototype.subscribe = function (onChange) {
        this.onChanges.push(onChange);
    };
    UserModel.prototype.inform = function () {
        this.onChanges.forEach(function (cb) { cb(); });
    };
    UserModel.prototype.find = function (name) {
        return this.userMap[name];
    };
    UserModel.prototype.onAllUsers = function (message) {
        var messageBody = JSON.parse(message.body);
        this.setUsers(messageBody.allUsers);
    };
    UserModel.prototype.setUsers = function (usersToSet) {
        var _this = this;
        this.users = usersToSet;
        this.users.forEach(function (u) {
            _this.userMap[u.name] = u;
        });
        this.inform();
    };
    return UserModel;
}());
exports.UserModel = UserModel;
