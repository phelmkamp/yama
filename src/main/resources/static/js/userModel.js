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
