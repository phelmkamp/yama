/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.d.ts"/>

class UserItem extends React.Component<IUserItemProps, IConvoItemState> {

  public state : IConvoItemState;

  constructor(props : IUserItemProps){
    super(props);
    this.state = { title: this.props.user.id };
  }

  handleChange(event: __React.MouseEvent) {
    event.preventDefault();
    this.props.onChange();
  }

  public render() {
    return (
      <a href="#"
        className="list-group-item"
        onClick={e => this.handleChange(e)}
        data-dismiss="modal">
          {this.state.title}
      </a>
    );
  }
}

export { UserItem };
