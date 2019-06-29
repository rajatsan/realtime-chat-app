import React from 'react';
import { sessionApi, activeUsersApi } from '../../api';
import io from 'socket.io-client';
import ViewVideo from '../ViewVideoComponent';
import Button from '@material-ui/core/Button';

import './HomeComponent.css';

class HomeComponent extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      allMessages: [],
      imageSrc: null,
    }
  }

  componentDidMount() {
    this.socket = io.connect('', { query: `username=${this.props.user}`});

    this.socket.on('video', (image) => {
      this.setState({ imageSrc: image })
    })

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
    this.socket.disconnect();
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
      <div>
         <div className='header'>
          <div className='title'>Real-Time Chat Application</div>
            <Button color='inherit' onClick={this.logout}>Logout</Button>
        </div>
        Home
        <button onClick={this.logout}>Logout</button>
        <div>Logged in as {this.props.user}</div>
        <div>
          <span>Enter message</span>
          <input onChange={e => this.setState({message: e.target.value})}/>
        </div>
        
        <button onClick={this.sendMessage}>Send message</button>
        {(this.state.allMessages || []).map(message => 
          <div>{message}</div>)}

        <ViewVideo socket={this.socket}/>
        <img src={this.state.imageSrc}/>
      </div>
    )
  }
}

export default HomeComponent;