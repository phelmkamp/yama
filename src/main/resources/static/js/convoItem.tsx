/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.d.ts"/>

declare var componentHandler;

class ConvoItem extends React.Component<IConvoItemProps, IConvoItemState> {

  public constructor() {
    super();
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
        onClick={e => this.onSelect(e)}>
          <span className="mdl-list__item-primary-content">
            <i className="material-icons mdl-list__item-avatar">chat</i>
            <span>{this.props.usernames.join(", ")}</span>
          </span>
          <a className="mdl-list__item-secondary-action"
            onClick={e => this.onDelete(e)}>
              <i className="material-icons">delete</i>
          </a>
      </div>
    );
  }

  private onSelect(event: __React.MouseEvent) {
    event.preventDefault();
    this.props.onSelect();
  }

  private onDelete(event: __React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onDestroy();
  }
}

export { ConvoItem };
