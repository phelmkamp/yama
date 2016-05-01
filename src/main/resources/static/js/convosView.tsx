/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import { ConvoItem } from "./convoItem";

declare var componentHandler;

class ConvosView extends React.Component<IConvosViewProps, IConvosViewState> {

  public constructor(props: IConvosViewProps) {
    super();
  }

  public componentDidMount() {
    componentHandler.upgradeDom();
  }

  public componentDidUpdate(prevProps, prevState, prevContext) {
    componentHandler.upgradeDom();
  }

  public render() {
    var convos = this.props.convoModel.convos;
    var convoPane;
    if (convos.length > 0) {
      var convoItems = convos.map((convo) => {

        // <ConvoItem
        //   convoId={convo.id}
        //   stompClient={this.props.stompClient}
        //   onDestroy={() => {}}
        //   onSelect={() => {}}
        // />

        var usernames: Array<string> = convo.users
          .filter(u => {
            return u.name !== this.props.thisUser.name;
          })
          .map(u => {
            return u.displayName;
          });
        // for (var u in convo.content) {
        //   if (u !== this.props.thisUsername) {
        //     usernames.push(u);
        //   }
        // }
        return (
          <ConvoItem
            usernames={usernames}
            onDestroy={this.onDeleteConvoAction.bind(this, convo)}
            onSelect={this.onSelectConvoAction.bind(this, convo)}
          />
        );
      });

      convoPane = (
        <div className="mdl-list">
          {convoItems}
        </div>
      );
    } else {
      convoPane = (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <h4>no active conversations</h4>
          </div>
        </div>
      );
    }

    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header className="mdl-layout__header">
  		    <div className="mdl-layout__header-row">
  		      <span className="mdl-layout-title">conversations</span>
  		      <div className="mdl-layout-spacer"></div>
  		      <nav className="mdl-navigation mdl-layout--large-screen-only">
  		        <a className="mdl-navigation__link"
                href=""
                onClick={(e) => this.onLogout(e)}>logout</a>
  		      </nav>
  		    </div>
  		  </header>
  		  <div className="mdl-layout__drawer">
  		    <span className="mdl-layout-title">yama</span>
  		    <nav className="mdl-navigation">
            <a className="mdl-navigation__link"
              href=""
              onClick={(e) => this.onLogout(e)}>logout</a>
  		    </nav>
  		  </div>
        {convoPane}
  		  <main className="mdl-layout__content">
          <button
            type="button"
            onClick={e => this.onNewConvoButton(e)}
            className={classNames("mdl-button",
              "mdl-js-button",
              "mdl-button--fab",
              "mdl-js-ripple-effect",
              "mdl-button--colored",
              "floating-fab")}>
              <i className="material-icons">add</i>
          </button>
  		  </main>
        <form id="logout" action="/logout" method="post" type="hidden" >
          <input type="hidden"
            name={this.props.csrf.parameterName}
            value={this.props.csrf.token} />
        </form>
      </div>
    );
  }

  private onNewConvoButton(event: __React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onNewConvoButton();
  }

  private onDeleteConvoAction(convo: IConvo) {
    this.props.convoModel.remove(convo);
  }

  private onSelectConvoAction(convo: IConvo) {
    this.props.onSelectConvo(convo);
  }

  private onLogout(event: __React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    var form: HTMLFormElement = document.getElementById('logout') as HTMLFormElement;
    form.submit();
  }
}

export { ConvosView };
