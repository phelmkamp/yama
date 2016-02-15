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
class UserModel implements IUserModel {

  public key : string;
  public users : Array<IUser>;
  public onChanges : Array<any>;

  private userMap: any;

  constructor(key) {
    this.key = key;
    this.users = []; //Utils.store(key);
    this.onChanges = [];
    this.userMap = {};
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    Utils.store(this.key, this.users);
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public setUsers(usersToSet : Array<IUser>) {
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
  }

  public destroy(user : IUser) {
    this.users = this.users.filter(function (candidate) {
      return candidate !== user;
    });

    delete this.userMap[user.id];

    console.log("removed user " + JSON.stringify(user));

    this.inform();
  }
}

export { UserModel };
