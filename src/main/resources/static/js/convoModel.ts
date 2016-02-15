/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import { Utils } from "./utils";

// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
class ConvoModel implements IConvoModel {

  public key : string;
  public convos : Array<IConvo>;
  public onChanges : Array<any>;

  constructor(key) {
    this.key = key;
    this.convos = []; //Utils.store(key);
    this.onChanges = [];
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    Utils.store(this.key, this.convos);
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public addConvo(convo : IConvo) {
    this.convos = this.convos.concat({
      id: convo.id, //Utils.uuid(),
      users: convo.users
    });

    this.inform();
  }

  public destroy(convo : IConvo) {
    this.convos = this.convos.filter(function (candidate) {
      return candidate !== convo;
    });

    this.inform();
  }

  public save(convoToSave : IConvo) {
    this.convos = this.convos.map(function (convo) {
      return convo !== convoToSave ? convo : Utils.extend({}, convo, {users: convoToSave.users});
    });

    this.inform();
  }
}

export { ConvoModel };
