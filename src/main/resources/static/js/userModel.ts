/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.d.ts"/>

class UserModel implements IUserModel {

  public key: string;
  public users: Array<IUser>;

  private onChanges: Array<any>;
  private stompClient;
  private userMap: {[key:string]:IUser};
  private thisUser: IUser;

  public constructor(key: string, thisUser: IUser, stompClient) {
    this.key = key;
    this.thisUser = thisUser;

    // var thisUser = {name: thisUsername};
    // this.users = [thisUser];
    // this.userMap = {};
    // this.userMap[thisUsername] = thisUser;
    this.users = [];
    this.userMap = {};

    this.stompClient = stompClient;
    this.onChanges = [];

    // var userTopic = "/topic/users/" + thisUsername;
    var userTopic = "/user";
    this.stompClient.subscribe('/topic/users', this.onAllUsers.bind(this), {});
    // this.stompClient.subscribe('/topic/newUsers', this.onUserJoin.bind(this), {});
    // this.stompClient.subscribe('/topic/exitingUsers', this.onUserLeft.bind(this), {});
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public find(name: string) {
    return this.userMap[name];
  }

  // private onUserLeft(message) {
  //   var messageBody = JSON.parse(message.body);
  //   this.destroy(messageBody);
  // }

  private onAllUsers(message) {
    var messageBody = JSON.parse(message.body);
    this.setUsers(messageBody.allUsers);
  }

  // private onUserJoin(message) {
  //   var messageBody: IUser = JSON.parse(message.body);
  //   this.addUsers([messageBody]);
  //
  //   // if (this.thisUsername !== messageBody.name) {
  //   //   this.stompClient.send("/app/welcome",
  //   //     {},
  //   //     JSON.stringify({to: messageBody.name, allUsers: this.users}));
  //   // }
  // }

  private setUsers(usersToSet: Array<IUser>) {
    this.users = usersToSet;
    this.users.forEach(u => {
      this.userMap[u.name] = u;
    });
    this.inform();
  }

  // private addUsers(usersToSet : Array<IUser>) {
  //   var users = this.users;
  //   var userMap = this.userMap;
  //   usersToSet.forEach(this.addUser.bind(this));
  // }
  //
  // private addUser(u: IUser) {
  //   if (!this.userMap.hasOwnProperty(u.name)) {
  //     this.users.push(u);
  //     this.userMap[u.name] = u;
  //     this.inform();
  //     console.log("added user " + JSON.stringify(u));
  //   }
  // }

  // public destroy(user : IUser) {
  //   var deletedUser: IUser = null;
  //   this.users = this.users.filter(function (candidate) {
  //     var found = candidate.session == user.session;
  //     if (found) {
  //       deletedUser = candidate;
  //     }
  //     return !found;
  //   });
  //
  //   if (deletedUser) {
  //     delete this.userMap[deletedUser.name];
  //     this.inform();
  //     console.log("removed user " + JSON.stringify(deletedUser));
  //   }
  // }
}

export { UserModel };
