interface IUser {
  id: string;
}

interface IConvo {
  id: string,
  users: Array<IUser>;
}

interface IConvoModel {
  key : any;
  convos : Array<IConvo>;
  onChanges : Array<any>;
  subscribe(onChange);
  inform();
  addConvo(convo: IConvo);
  save(convoToSave: IConvo);
  destroy(convo: IConvo);
}

interface IConvoItemProps {
  key : string,
  convo : IConvo;
  active? : boolean;
  onSave: (val: any) => void;
  onDestroy: () => void;
  onChange: ()  => void;
}

interface IConvoItemState {
  title: string
}

interface IUserModel {
  key : any;
  users : Array<IUser>;
  onChanges : Array<any>;
  subscribe(onChange);
  inform();
  setUsers(users: Array<IUser>);
  destroy(user: IUser);
}

interface IUserItemProps {
  user: IUser;
  onChange: ()  => void;
}

interface StompListener {
  onConnect(frame): void;
}



interface ITodo {
  id: string,
  title: string,
  completed: boolean
}

interface ITodoItemProps {
  key : string,
  todo : ITodo;
  editing? : boolean;
  onSave: (val: any) => void;
  onDestroy: () => void;
  onEdit: ()  => void;
  onCancel: (event : any) => void;
  onToggle: () => void;
}

interface ITodoItemState {
  editText : string
}

interface ITodoFooterProps {
  completedCount : number;
  onClearCompleted : any;
  nowShowing : string;
  count : number;
}


interface ITodoModel {
  key : any;
  todos : Array<ITodo>;
  onChanges : Array<any>;
  subscribe(onChange);
  inform();
  addTodo(title : string);
  toggleAll(checked);
  toggle(todoToToggle);
  destroy(todo);
  save(todoToSave, text);
  clearCompleted();
}

interface IAppProps {
  model : IConvoModel;
  stompClient : any;
  user: string;
}

interface IUserProps {
  model: IUserModel;
  stompClient : any;
  user: string;
}

interface IAppState {
  editing? : string;
  nowShowing? : string
}
