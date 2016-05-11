(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./chatView":2,"./constants":3,"./convoModel":5,"./convosView":6,"./userModel":8,"./usersView":9,"./utils":10}],2:[function(require,module,exports){
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
            React.createElement("div", {className: "mdl-grid"}, 
                React.createElement("div", {className: "mdl-cell mdl-cell--12-col"}, 
                    React.createElement("h4", null, usernames[0]), 
                    React.createElement("p", {ref: "response2", className: ""}, this.getContent())), 
                React.createElement("div", {className: "mdl-cell mdl-cell--12-col"}, 
                    React.createElement("form", {action: "#"}, 
                        React.createElement("div", {className: "mdl-textfield mdl-js-textfield mdl-textfield--floating-label"}, 
                            React.createElement("label", {htmlFor: "newField", className: "mdl-textfield__label"}, "you"), 
                            React.createElement("textarea", {type: "text", className: "mdl-textfield__input", id: "newField", ref: "newField", onKeyUp: function (e) { return _this.onType(e); }, autoFocus: true, rows: 5}, this.props.convo.content[this.props.thisUser.name]))
                    )
                ))));
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ConvoItem = (function (_super) {
    __extends(ConvoItem, _super);
    function ConvoItem() {
        _super.call(this);
    }
    ConvoItem.prototype.componentDidMount = function () {
        componentHandler.upgradeDom();
    };
    ConvoItem.prototype.componentDidUpdate = function (prevProps, prevState, prevContext) {
        componentHandler.upgradeDom();
    };
    ConvoItem.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {className: "mdl-list__item ios-tappable", onClick: function (e) { return _this.onSelect(e); }}, 
            React.createElement("span", {className: "mdl-list__item-primary-content"}, 
                React.createElement("i", {className: "material-icons mdl-list__item-avatar"}, "chat"), 
                React.createElement("span", null, this.props.usernames.join(", "))), 
            React.createElement("a", {className: "mdl-list__item-secondary-action", onClick: function (e) { return _this.onDelete(e); }}, 
                React.createElement("i", {className: "material-icons"}, "delete")
            )));
    };
    ConvoItem.prototype.onSelect = function (event) {
        event.preventDefault();
        this.props.onSelect();
    };
    ConvoItem.prototype.onDelete = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onDestroy();
    };
    return ConvoItem;
}(React.Component));
exports.ConvoItem = ConvoItem;

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./convoItem":4}],7:[function(require,module,exports){
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
    }
    UserItem.prototype.componentDidMount = function () {
        componentHandler.upgradeDom();
    };
    UserItem.prototype.componentDidUpdate = function (prevProps, prevState, prevContext) {
        componentHandler.upgradeDom();
    };
    UserItem.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {className: "mdl-list__item ios-tappable", onClick: function (e) { return _this.handleSelect(e); }}, 
            React.createElement("span", {className: "mdl-list__item-primary-content"}, 
                this.getIcon(), 
                React.createElement("span", null, this.props.user.displayName))
        ));
    };
    UserItem.prototype.getIcon = function () {
        if (this.props.user.iconUrl) {
            return (React.createElement("img", {className: "material-icons mdl-list__item-avatar", src: this.props.user.iconUrl}));
        }
        else {
            return (React.createElement("i", {className: "material-icons mdl-list__item-avatar"}, "person"));
        }
    };
    UserItem.prototype.handleSelect = function (event) {
        event.preventDefault();
        this.props.onSelect();
    };
    return UserItem;
}(React.Component));
exports.UserItem = UserItem;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var userItem_1 = require("./userItem");
var UsersView = (function (_super) {
    __extends(UsersView, _super);
    function UsersView(props) {
        _super.call(this);
    }
    UsersView.prototype.componentDidMount = function () {
        componentHandler.upgradeDom();
    };
    UsersView.prototype.componentDidUpdate = function () {
        componentHandler.upgradeDom();
    };
    UsersView.prototype.render = function () {
        var _this = this;
        var users = this.props.userModel.users.filter(function (user) {
            return user.name !== _this.props.thisUser.name;
        });
        var userPane;
        if (users.length > 0) {
            var userItems = users.map(function (user) {
                return (React.createElement(userItem_1.UserItem, {user: user, onSelect: _this.onUserSelect.bind(_this, user)}));
            });
            userPane = (React.createElement("main", {className: "mdl-layout__content"}, 
                React.createElement("div", {className: "mdl-list"}, userItems)
            ));
        }
        else {
            userPane = (React.createElement("div", {className: "mdl-grid"}, 
                React.createElement("div", {className: "mdl-cell mdl-cell--12-col"}, 
                    React.createElement("h4", null, "no other users are online at this time :(")
                )
            ));
        }
        return (React.createElement("div", {className: "mdl-layout mdl-js-layout mdl-layout--fixed-header"}, 
            React.createElement("header", {className: "mdl-layout__header"}, 
                React.createElement("button", {className: "mdl-layout-icon mdl-button mdl-js-button mdl-button--icon", onClick: function (e) { return _this.onBackButton(e); }}, 
                    React.createElement("i", {className: "material-icons"}, "arrow_back")
                ), 
                React.createElement("div", {className: "mdl-layout__header-row"}, 
                    React.createElement("span", {className: "mdl-layout-title"}, "users"), 
                    React.createElement("div", {className: "mdl-layout-spacer"}), 
                    React.createElement("nav", {className: "mdl-navigation mdl-layout--large-screen-only"}, 
                        React.createElement("a", {className: "mdl-navigation__link", href: "", onClick: function (e) { return _this.onLogout(e); }}, "logout"), 
                        React.createElement("form", {id: "logout", action: "/logout", method: "post"}, 
                            React.createElement("input", {type: "hidden", name: this.props.csrf.parameterName, value: this.props.csrf.token})
                        )))), 
            userPane));
    };
    UsersView.prototype.onUserModelChanged = function () {
        this.setState({});
    };
    UsersView.prototype.onUserSelect = function (user) {
        this.props.onUsersSelected([user]);
    };
    UsersView.prototype.onBackButton = function (event) {
        event.preventDefault();
        this.props.onBack();
    };
    UsersView.prototype.onLogout = function (event) {
        event.preventDefault();
        event.stopPropagation();
        var form = document.getElementById('logout');
        form.submit();
    };
    return UsersView;
}(React.Component));
exports.UsersView = UsersView;

},{"./userItem":7}],10:[function(require,module,exports){
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
        return (store && JSON.parse(store)) || null;
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
