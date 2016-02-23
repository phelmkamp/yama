/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.d.ts"/>

declare var componentHandler;

class UserItem extends React.Component<IUserItemProps, IUserItemState> {

  public constructor(props : IUserItemProps){
    super(props);
  }

  public componentDidMount() {
    componentHandler.upgradeDom();
  }

  public componentDidUpdate(prevProps, prevState, prevContext) {
    componentHandler.upgradeDom();
  }

  public render() {
    return (
      <div
        className="mdl-list__item"
        onClick={e => this.handleSelect(e)}>
        <span className="mdl-list__item-primary-content">
          {this.getIcon()}
          <span>{this.props.user.displayName}</span>
        </span>
      </div>
    );
  }

  private getIcon() {
    if (this.props.user.iconUrl) {
      return (
        <img className="material-icons mdl-list__item-avatar"
          src={this.props.user.iconUrl} />
      );
    } else {
      return (<i className="material-icons mdl-list__item-avatar">person</i>);
    }
  }

  private handleSelect(event: __React.MouseEvent) {
    event.preventDefault();
    this.props.onSelect();
  }
}

export { UserItem };
