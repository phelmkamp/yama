"use strict";
var ConvoModel = (function () {
    function ConvoModel(key, stompClient) {
        this.key = key;
        this.stompClient = stompClient;
        this.convos = [];
        this.onChanges = [];
        this.convosMap = {};
        this.stompClient.subscribe('/user/queue/convos', this.onConvoChanged.bind(this));
        this.stompClient.subscribe('/user/queue/messages', this.onMessage.bind(this));
    }
    ConvoModel.prototype.subscribe = function (onChange) {
        this.onChanges.push(onChange);
    };
    ConvoModel.prototype.inform = function () {
        this.onChanges.forEach(function (cb) { cb(); });
    };
    ConvoModel.prototype.add = function (users) {
        var content = {};
        for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
            var u = users_1[_i];
            content[u.name] = '';
        }
        var convo = { id: null, content: content, users: users };
        this.stompClient.send('/app/newConvo', {}, JSON.stringify(convo));
        return convo;
    };
    ConvoModel.prototype.remove = function (convo) {
        this.convos = this.convos.filter(function (candidate) {
            return candidate !== convo;
        });
        delete this.convosMap[convo.id];
        this.inform();
    };
    ConvoModel.prototype.onConvoChanged = function (message) {
        var convo = JSON.parse(message.body);
        if (!this.convosMap.hasOwnProperty(convo.id)) {
            this.onConvoAdded(convo);
        }
        else {
        }
    };
    ConvoModel.prototype.onConvoAdded = function (convo) {
        this.convos.push(convo);
        this.convosMap[convo.id] = convo;
        this.inform();
    };
    ConvoModel.prototype.onMessage = function (message) {
        var messageBody = JSON.parse(message.body);
        var destConvo = messageBody.convoId;
        var convo = this.convosMap[destConvo];
        if (convo) {
            convo.content[messageBody.sender] = messageBody.content;
        }
        this.inform();
    };
    return ConvoModel;
}());
exports.ConvoModel = ConvoModel;
