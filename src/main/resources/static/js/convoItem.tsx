/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import { ENTER_KEY, ESCAPE_KEY } from "./constants";

class ConvoItem extends React.Component<IConvoItemProps, IConvoItemState> {

  public state : IConvoItemState;

  constructor(props : IConvoItemProps){
    super(props);
    this.state = { title: this.buildTitle(this.props.convo) };
  }

  buildTitle(convo: IConvo) {
    var text = convo.users.reduce(function (title, user) {
      return title += user.id + ", ";
    }, "");
    return text.substring(0, text.length - 2);
  }

  getActiveText() {
    var activeText = this.props.active ? "active" : "";
    return activeText;
  }

  handleChange(event: __React.MouseEvent) {
    event.preventDefault();
    this.props.onChange();
  }

  handleDeleteButton(event: __React.MouseEvent) {
    event.preventDefault();
    this.props.onDestroy();
  }

  // <button
  //   type="button"
  //   className="btn btn-success btn-xs"
  //   data-toggle="modal"
  //   data-target="#userDialog">
  //   <span className="glyphicon glyphicon-plus"></span>
  // </button>

  public render() {
    return (
      <a href="#"
        className="list-group-item"
        onClick={e => this.handleChange(e)}>
          {this.state.title}
          <div className="btn-group pull-right" role="group">
            <button
              type="button"
              className="btn btn-danger btn-xs"
              onClick={ e => this.handleDeleteButton(e) }>
              <span className="glyphicon glyphicon-trash"></span>
            </button>
          </div>
      </a>
    );
  }
}

export { ConvoItem };
