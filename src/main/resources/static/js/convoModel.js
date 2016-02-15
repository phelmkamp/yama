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
