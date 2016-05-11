/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import { View } from "./constants";

import { UserModel } from "./userModel";
import { UsersView } from "./usersView";

import { ConvoModel } from "./convoModel";
import { ConvosView } from "./convosView";

import { ChatView } from "./chatView";

import { Utils } from "./utils";

declare var componentHandler;

class MainView extends React.Component<IMainViewProps, IMainViewState> {

  private userModel: IUserModel;
  private convoModel: IConvoModel;

  public constructor(props: IMainViewProps) {
    super();

    this.userModel = new UserModel('yama-users', props.thisUser, props.stompClient);
    this.userModel.subscribe(this.onUserModelChanged.bind(this));
    // props.stompClient.send("/app/newUsers", {}, null);

    this.state = { activeView: View.Convos };
    this.convoModel = new ConvoModel('yama-convos', props.stompClient);
    this.convoModel.subscribe(this.onConvoModelChanged.bind(this));
  }

  public componentDidUpdate(prevProps, prevState, prevContext) {
    componentHandler.upgradeDom();
  }

  public render() {
    switch(this.state.activeView) {
      case View.Users:
        return this.renderUsers();
      case View.Chat:
        return this.renderChat();
      default:
        return this.renderConvos();
    }
  }

  private renderConvos() {
    return (
      <ConvosView
        thisUser={Utils.extend(this.props.thisUser)}
        convoModel={this.convoModel}
        onNewConvoButton={() => {this.setState({ activeView: View.Users })}}
        onSelectConvo={(convo) => {this.setState({ activeView: View.Chat, activeConvo: convo })}}
        stompClient={this.props.stompClient}
        csrf={this.props.csrf} />
    );
  }

  private renderUsers() {
    return (
      <UsersView
        thisUser={Utils.extend(this.props.thisUser)}
        userModel={this.userModel}
        onUsersSelected={users => this.onUsersSelected(users)}
        onBack={() => this.setState({activeView: View.Convos})}
        csrf={this.props.csrf} />
    );
  }

  private renderChat() {
    return (
      <ChatView
        thisUser={Utils.extend(this.props.thisUser)}
        convo={this.state.activeConvo}
        onBack={() => this.setState({activeView: View.Convos})}
        csrf={this.props.csrf}
        stompClient={this.props.stompClient} />
    );
  }

  private onUsersSelected(users: Array<IUser>) {
    // var usernames = users.map(user => {
    //   return user.name;
    // });
    // usernames.push(this.props.thisUsername);
    var copy: Array<IUser> = users.map(u => {
      return Utils.extend(u);
    });
    copy.push(Utils.extend(this.props.thisUser));
    var convo = this.convoModel.add(copy);
    // this.setState({activeView: View.Chat, activeConvo: convo});
    this.setState({activeView: View.Convos});
  }

  private onConvoModelChanged() {
    this.forceUpdate();
  }

  private onUserModelChanged() {
    if (!this.props.thisUser.session) {
      var user = this.userModel.find(this.props.thisUser.name);
      if (user) {
        this.props.thisUser = Utils.extend(user);
      }
    }
    else {
      this.forceUpdate();
    }
  }
}

declare var SockJS;
declare var Stomp;

var request = new XMLHttpRequest();
request.onload = connect;
request.open("GET", "/csrf", true);
request.send();

var stompClient;
var csrf : ICsrf;

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
  var thisUser: IUser = {name: thisUsername, session: null,
    displayName: "you", iconUrl: null};
  React.render(
    <MainView stompClient={stompClient}
      thisUser={thisUser}
      csrf={csrf} />,
    document.getElementsByClassName('main')[0]
  );
}
