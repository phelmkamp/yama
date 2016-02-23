/// <reference path="../../typings/main.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import { UserItem } from "./userItem";

declare var componentHandler;

class UsersView extends React.Component<IUsersViewProps, IUsersViewState> {

  public constructor(props: IUsersViewProps) {
    super();
    // props.userModel.subscribe(this.onUserModelChanged.bind(this));
  }

  public componentDidMount() {
    componentHandler.upgradeDom();
  }

  public componentDidUpdate() {
    componentHandler.upgradeDom();
  }

  public render() {
    var users = this.props.userModel.users.filter((user) => {
      return user.name !== this.props.thisUser.name;
    });

    var userPane;
    if (users.length > 0) {
      var userItems = users.map((user) => {
        return (
          <UserItem
            user={user}
            onSelect={this.onUserSelect.bind(this, user)}
          />
        );
      });

      userPane = (
        <main className="mdl-layout__content">
          <div className="mdl-list">
            {userItems}
          </div>
        </main>
      );
    } else {
      userPane = (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <h4>no users yet</h4>
          </div>
        </div>
      );
    }

    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header className="mdl-layout__header">
          <button
            className="mdl-layout-icon mdl-button mdl-js-button mdl-button--icon"
            onClick={e => this.onBackButton(e)}>
            <i className="material-icons">arrow_back</i>
          </button>
  		    <div className="mdl-layout__header-row">
  		      <span className="mdl-layout-title">users</span>
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
        {userPane}
      </div>
    );
  }

  private onUserModelChanged() {
    this.setState({});
  }

  private onUserSelect(user: IUser) {
    this.props.onUsersSelected([user]);
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

export { UsersView };
