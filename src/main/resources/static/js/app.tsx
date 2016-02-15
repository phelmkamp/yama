/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/

/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.d.ts"/>

declare var Router;
declare var SockJS;
declare var Stomp;

import { ConvoModel } from "./convoModel";
import { ConvoItem } from "./convoItem";

import { UserModel } from "./userModel";
import { UserItem } from "./userItem";

class TodoApp extends React.Component<IAppProps, IAppState> {

  public state : IAppState;

  // public user: string;

  constructor(props : IAppProps) {
    super(props);
    this.state = {
      editing: null
    };
  }

  public componentDidMount() {
    var setState = this.setState;

    this.connect();
  }

  connect() {
    this.props.stompClient.connect({}, this.onConnect.bind(this));
  }

  onConnect(frame) {
    // console.log('Connected: ' + frame);
    user = frame.headers['user-name'];

    // userModel.setUsers([{id: this.user}]);

    var userTopic = "/topic/users/" + user;
    this.props.stompClient.subscribe(userTopic + '/allUsers', this.onAllUsers.bind(this), {});

    this.props.stompClient.send("/app/honiara/newUsers", {}, null);

    this.props.stompClient.subscribe('/topic/newUsers', this.onUserJoin.bind(this), {});
    this.props.stompClient.subscribe('/topic/exitingUsers', this.onUserLeft.bind(this), {});
    this.props.stompClient.subscribe(userTopic + '/newConvos', this.onConvoAdded.bind(this), {});
  }

  public onMessage(message) {
    // console.log("onMessage: " + message);
    var messageBody = JSON.parse(message.body);
    if (messageBody.sender != user) {
      // var textNode = React.createElement(messageBody.content);
      var response2 = React.findDOMNode<HTMLParagraphElement>(this.refs["response2"]);
      response2.innerHTML = messageBody.content;
      // React.render(textNode, response2);
    }

    // userModel.setUsers(messageBody.allUsers);
  }

  public onConvoAdded(message) {
    var messageBody = JSON.parse(message.body);
    this.props.model.addConvo(messageBody);

    this.props.stompClient.subscribe('/topic/convos/' + messageBody.id, this.onMessage.bind(this), {});
  }

  public onUserLeft(message) {
    var messageBody = JSON.parse(message.body);
    userModel.destroy(messageBody.user);
  }

  public onAllUsers(message) {
    // this.props.stompClient.unsubscribe('/topic/allUsers');

    var messageBody = JSON.parse(message.body);
    userModel.setUsers(messageBody.allUsers);
  }

  public onUserJoin(message) {
    var messageBody = JSON.parse(message.body);
    userModel.setUsers([messageBody]);

    this.props.stompClient.send("/app/honiara/users/" + messageBody.id + "/allUsers", {},
      JSON.stringify({ 'allUsers': userModel.users }));
  }

  public handleNewTodoKeyDown(event : __React.KeyboardEvent) {
    event.preventDefault();
    var val = React.findDOMNode<HTMLInputElement>(this.refs["newField"]).value.trim();
    this.props.stompClient.send("/app/honiara/convos/" + this.state.editing, {},
      JSON.stringify({ 'content': val }));
  }

  // public handleNewConvoButton(event: __React.MouseEvent) {
  //   event.preventDefault();
  //   var convo = {id: null, users: [{id: this.user}]};
  //   this.props.stompClient.send("/app/honiara/newConvos", {}, JSON.stringify(convo));
  // }

  public destroy(convo : IConvo) {
    this.props.model.destroy(convo);
  }

  public change(convo : IConvo) {
    this.setState({editing: convo.id});
    console.log("editing: " + JSON.stringify(convo));
  }

  public save(convoToSave : IConvo) {
    this.props.model.save(convoToSave);
    // this.setState({editing: null});
  }

  public render() {
    var footer;
    var main;

    const convos = this.props.model.convos;

    var convoItems = convos.map((convo) => {
      return (
        <ConvoItem
          key={convo.id}
          convo={convo}
          onDestroy={this.destroy.bind(this, convo)}
          active={this.state.editing === convo.id}
          onSave={this.save.bind(this, convo)}
          onChange={this.change.bind(this, convo)}
        />
      );
    });

    footer = (
      <div className="row">
        <div className="col-xs-12">
          <footer>
            <p>&copy; copyright 2016 phil helmkamp</p>
          </footer>
        </div>
      </div>
    );

    // onClick={ e => this.handleNewConvoButton(e) }

    main = (
      <div className="row">
        <div className="col-xs-4">
          <div className="row">
            <button
              type="button"
              className="btn btn-default btn-sm pull-right"
              data-toggle="modal"
              data-target="#userDialog">
                <span className="glyphicon glyphicon-asterisk"></span>
            </button>
          </div>
          <div className="row">
            <div className="list-group">
              {convoItems}
            </div>
          </div>
        </div>
        <div className="form-group col-xs-4">
            <label>you</label>
            <textarea
              type="text"
              className="form-control"
              ref="newField"
              placeholder="chat here"
              onKeyUp={ e => this.handleNewTodoKeyDown(e) }
              autoFocus={true}
              rows={5}>
            </textarea>
        </div>
        <div className="col-xs-4">
          <label>friend</label>
          <p ref="response2" className="text-primary"></p>
        </div>
      </div>
    );

    return (
      <div className="container">
        {main}
        <hr />
        {footer}
      </div>
    );
  }
}

class Users extends React.Component<IUserProps, IAppState> {

  public state : IAppState;

  // private user: string;

  constructor(props : IUserProps) {
    super(props);
    this.state = {
      editing: null
    };
  }

  public componentDidMount() {
    var setState = this.setState;
    // this.onConnect();
  }

  // onConnect() {
  //   this.props.stompClient.subscribe('/topic/users', this.onUsersChanged.bind(this), {});
  // }

  // public onUsersChanged(message) {
  //   var messageBody = JSON.parse(message.body);
  //   this.props.model.setUsers(messageBody);
  // }

  public change(selectedUser : IUser) {
    var convo = {id: null, users: [{id: user}, {id: selectedUser.id}]};
    this.props.stompClient.send("/app/honiara/newConvos", {}, JSON.stringify(convo));
  }

  public render() {
    var main;

    const users = this.props.model.users;

    var userItems = users.map((user) => {
      return (
        <UserItem
          user={user}
          onChange={this.change.bind(this, user)}
        />
      );
    });

    return (
      <div className="list-group">
        {userItems}
      </div>
    );
  }
}

var model = new ConvoModel('convos');
var userModel = new UserModel('users');

var socket = new SockJS('/honiara');
var stompClient = Stomp.over(socket);

var user = null;

function render() {
  React.render(
    <TodoApp model={model} stompClient={stompClient} user={null}/>,
    document.getElementsByClassName('todoapp')[0]
  );
}

function renderUsers() {
  React.render(
    <Users model={userModel} stompClient={stompClient} user={null}/>,
    document.getElementsByClassName('usersview')[0]
  );
}

model.subscribe(render);
userModel.subscribe(renderUsers);
render();
renderUsers();
