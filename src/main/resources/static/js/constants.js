"use strict";
var View;
(function (View) {
    View[View["Convos"] = 0] = "Convos";
    View[View["Users"] = 1] = "Users";
    View[View["Chat"] = 2] = "Chat";
})(View || (View = {}));
exports.View = View;
var CONVOS_TOPIC = '/queue/convos/';
exports.CONVOS_TOPIC = CONVOS_TOPIC;
