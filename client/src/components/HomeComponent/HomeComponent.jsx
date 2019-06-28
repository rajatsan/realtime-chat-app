import React from 'react';
import { sessionApi, activeUsersApi } from '../../api';
import io from 'socket.io-client';

import './HomeComponent.css';

class HomeComponent extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      allMessages: [],
    }
  }

  componentDidMount() {
    this.socket = io.connect('', { query: `username=${this.props.user}`});

    // this.socket.emit('send message', {
    //   message: `${this.props.user} joined.`,
    //   username: this.props.user,
    // })

    this.socket.on('send message', ({ message, username }) => {
      this.setState({
        allMessages: this.state.allMessages.concat([message])
      });
    })
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  logout = () => {
    console.log('emitting disconnect yeah')
    this.socket.disconnect();
    this.socket.disconnect()
    fetch(sessionApi, {
      method: 'delete'
    })
    .then(this.props.onLogout);
  }

  sendMessage = () => {
    this.socket.emit('send message', { message: this.state.message, username: this.props.user });
  }

  render() {
    return (
      <div>Home
        <button onClick={this.logout}>Logout</button>
        <div>Logged in as {this.props.user}</div>
        <div>
          <span>Enter message</span>
          <input onChange={e => this.setState({message: e.target.value})}/>
        </div>
        
        <button onClick={this.sendMessage}>Send message</button>
        {(this.state.allMessages || []).map(message => 
          <div>{message}</div>)}
      </div>
    )
  }
}

export default HomeComponent;