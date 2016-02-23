interface ICsrf {
  headerName: string;
  token: string;
  parameterName: string;
}

// main
interface IMainViewProps {
  stompClient;
  thisUser: IUser;
  csrf: ICsrf;
}

interface IMainViewState {
  activeView: number;
  activeConvo?: IConvo;
}

// user
interface IUser {
  name: string;
  session: string;
  displayName: string;
  iconUrl: string;
}

interface IUserModel {
  users : Array<IUser>;
  subscribe(onChange);
  inform();
  find(name: string): IUser;
}

interface IUserItemProps {
  user: IUser;
  onSelect: ()  => void;
}

interface IUserItemState {}

interface IUsersViewProps {
  thisUser: IUser;
  userModel: IUserModel;
  onUsersSelected: (users: Array<IUser>) => void;
  onBack: () => void;
  csrf: ICsrf;
}

interface IUsersViewState {}

// convo list
interface IConvo {
  id: string,
  content: {[key:string]:string;};
  users: Array<IUser>;
}

interface IConvoModel {
  convos : Array<IConvo>;
  subscribe(onChange);
  inform();
  add(users: Array<IUser>): IConvo;
  remove(convo: IConvo);
}

interface IConvoItemProps {
  // convoId: string;
  // stompClient: any;
  usernames: Array<string>;
  onDestroy: () => void;
  onSelect: ()  => void;
}

interface IConvoItemState {}

interface IConvosViewProps {
  thisUser: IUser;
  convoModel: IConvoModel
  onNewConvoButton: () => void;
  onSelectConvo: (convo: IConvo) => void;
  stompClient;
  csrf: ICsrf;
}

interface IConvosViewState {}

// chat
interface IChatViewProps {
  thisUser: IUser;
  convo: IConvo;
  onBack: () => void;
  csrf: ICsrf;
  stompClient;
}

interface IChatViewState {}
