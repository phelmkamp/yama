/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import { Utils } from "./utils";

import { CONVOS_TOPIC } from "./constants";

class ConvoModel implements IConvoModel {

  public key: string;
  public convos: Array<IConvo>;

  private onChanges: Array<any>;
  private stompClient: any;
  private convosMap: {[key: string]: IConvo};

  public constructor(key: string, stompClient) {
    this.key = key;
    this.stompClient = stompClient;
    this.convos = [];
    this.onChanges = [];
    this.convosMap = {};

    this.stompClient.subscribe('/user/queue/convos', this.onConvoChanged.bind(this));
    this.stompClient.subscribe('/user/queue/messages', this.onMessage.bind(this));
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public add(users: Array<IUser>) {
    var content: {[key:string]:string} = {}
    for (var u of users) {
      content[u.name] = '';
    }
    // var convo = {id: Utils.uuid(), content: content};
    var convo: IConvo = {id: null, content: content, users: users};

    this.stompClient.send('/app/newConvo', {}, JSON.stringify(convo));

    return convo;
  }

  public remove(convo: IConvo) {
    this.convos = this.convos.filter(function (candidate) {
      return candidate !== convo;
    })

    delete this.convosMap[convo.id];

    this.inform();
  }

  private onConvoChanged(message) {
    var convo: IConvo = JSON.parse(message.body);
    if (!this.convosMap.hasOwnProperty(convo.id)) {
      this.onConvoAdded(convo);
    } else {

    }
  }

  private onConvoAdded(convo: IConvo) {
    // this.stompClient.subscribe(CONVOS_TOPIC + convo.id,
    //     this.onMessage.bind(this), {});

    this.convos.push(convo);
    this.convosMap[convo.id] = convo;
    this.inform();
  }

  private onMessage(message) {
    var messageBody = JSON.parse(message.body);
    // var dest = message.headers['destination'];
    // var destConvo = dest.substring(CONVOS_TOPIC.length);
    var destConvo = messageBody.convoId;
    var convo = this.convosMap[destConvo];
    if (convo) {
      convo.content[messageBody.sender] = messageBody.content;
    }
    this.inform();
  }
}

export { ConvoModel };
