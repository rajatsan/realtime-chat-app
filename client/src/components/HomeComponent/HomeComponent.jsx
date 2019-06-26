import React from 'react';
import { sessionApi } from '../../api';

import './HomeComponent.css';

class HomeComponent extends React.Component {
  logout = () => {
    fetch(sessionApi, {
      method: 'delete'
    })
    .then(this.props.onLogout);
  }

  render() {
    return (
      <div>Home
        <button onClick={this.logout}>Logout</button>
        <div>Logged in as {this.props.user}</div>
      </div>
    )
  }
}

export default HomeComponent;