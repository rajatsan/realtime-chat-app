import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import LoginComponent from './components/LoginComponent';
import HomeComponent from './components/HomeComponent';
import { sessionApi, allUsersApi } from './api';

import 'typeface-roboto';
import './App.css';

class App extends Component {
  state = {
    username: '',
    isLoading: false,
    users: [],
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    // check if user is logged in.
    fetch(sessionApi)
      .then(res => res.json())
      .then(res =>  {
        if (res.user && res.user.username) {
          this.setState({ username: res.user.username, isLoading: false })
        } else {
          this.setState({ username: '', isLoading: false })
        }
      })
      .catch(err => { this.setState({isLoading: false}); console.log(err)});

      // get all users
      this.fetchUsers();
  }

  fetchUsers = () => {
    fetch(allUsersApi)
      .then(res => res.json())
      .then(result => {
        this.setState({
          users: result.map(u => u.username.toLowerCase())
        });
      })
  }

  onLogout = () => {
    this.setState({ username: '' });
  }

  onLogin = (username) => {
    this.setState({ username })
  }
  
  render() {
    if (this.state.isLoading) {
      return <div className='body'><CircularProgress /></div>
    }

    return (
      <div>
        {this.state.username ? 
          <HomeComponent onLogout={this.onLogout} user={this.state.username} /> 
          : <LoginComponent onLogin={this.onLogin} users={this.state.users} fetchUsers={this.fetchUsers}/>
        }
      </div>
    );
  }
}

export default App;