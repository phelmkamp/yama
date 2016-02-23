/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.d.ts"/>

declare var componentHandler;

class ChatView extends React.Component<IChatViewProps, IChatViewState> {

  public constructor(props: IChatViewProps) {
    super();
  }

  public componentDidMount() {
    componentHandler.upgradeDom();
  }

  public componentDidUpdate(prevProps, prevState, prevContext) {
    componentHandler.upgradeDom();
  }

  public render() {
    var usernames: Array<string> = []
    // for (var u in this.props.convo.content) {
    for (var u of this.props.convo.users) {
      if (u.name !== this.props.thisUser.name) {
        usernames.push(u.displayName);
      }
    }

    // <div className="mdl-layout__drawer">
    //   <span className="mdl-layout-title">honiara</span>
    //   <nav className="mdl-navigation">
    //     <a className="mdl-navigation__link" href="">logout</a>
    //   </nav>
    // </div>

    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header className="mdl-layout__header">
          <button
            className="mdl-layout-icon mdl-button mdl-js-button mdl-button--icon"
            onClick={e => this.onBackButton(e)}>
            <i className="material-icons">arrow_back</i>
          </button>
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">{usernames.join(", ")}</span>
            <div className="mdl-layout-spacer"></div>
            <nav className="mdl-navigation mdl-layout--large-screen-only">
              <a className="mdl-navigation__link"
                href=""
                onClick={(e) => this.onLogout(e)}>logout</a>
              <form id="logout" action="/logout" method="post" >
                <input type="hidden"
                  name={this.props.csrf.parameterName}
                  value={this.props.csrf.token} />
              </form>
            </nav>
          </div>
        </header>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <h4>{usernames[0]}</h4>
            <p ref="response2" className="">{this.getContent()}</p>
          </div>
          <div className="mdl-cell mdl-cell--12-col">
            <form action="#">
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <label htmlFor="newField" className="mdl-textfield__label">you</label>
                  <textarea
                    type="text"
                    className="mdl-textfield__input"
                    id="newField"
                    ref="newField"
                    onKeyUp={ e => this.onType(e) }
                    autoFocus={true}
                    rows={5}>
                    {this.props.convo.content[this.props.thisUser.name]}
                  </textarea>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  private getContent() {
    var content: string = '';
    for (var user in this.props.convo.content) {
      if (user !== this.props.thisUser.name) {
        content = this.props.convo.content[user];
        break;
      }
    }
    return content;
  }

  private onType(event : __React.KeyboardEvent) {
    // event.preventDefault();
    var val = React.findDOMNode<HTMLInputElement>(this.refs["newField"]).value.trim();
    this.props.convo.content[this.props.thisUser.name] = val;
    this.props.stompClient.send("/app/convos/" + this.props.convo.id, {},
      JSON.stringify(this.props.convo));
  }

  private onBackButton(event: __React.MouseEvent) {
    event.preventDefault();
    this.props.onBack();
  }

  private onLogout(event: __React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    var form: HTMLFormElement = document.getElementById('logout') as HTMLFormElement;
    form.submit();
  }
}

export { ChatView };
