import React from 'react';
import { sessionApi, activeUsersApi } from '../../api';
import io from 'socket.io-client';
import ViewVideo from '../ViewVideoComponent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ChatComponent from '../ChatComponent';

import './HomeComponent.css';

class HomeComponent extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      allMessages: [],
      imageSrc: null,
      shareVideo: false,
      viewVideo: false,
      allusers: [],
    }
  }

  componentDidMount() {
    this.socket = io.connect('', { query: `username=${this.props.user}`});

    this.socket.on('video', (image) => {
      this.setState({ imageSrc: image })
    });

    this.socket.emit('join');
    console.log('called join event');
    this.socket.on('user', (list) => {
      console.log('mounting');
      this.setState({
        allusers: list
      })
    })

    this.socket.on('send message', ({ message, username }) => {
      console.log('messgae')
      this.setState({
        allMessages: this.state.allMessages.concat([message])
      });
    })
  }

  componentWillUnmount() {
    this.socket.emit('leave');
    this.socket.disconnect();
  }

  logout = () => {
    console.log('eavging');
    this.socket.emit('leave');
    this.socket.disconnect();
    fetch(sessionApi, {
      method: 'delete'
    })
    .then(this.props.onLogout);
  }

  sendMessage = () => {
    this.socket.emit('send message', { message: this.state.message, username: this.props.user });
  }

  getUserList = () => {
    return this.state.allusers.filter(u => {
      return u !== this.props.user.toLowerCase()
    })
  }

  render() {
    const activeUsers = this.getUserList();
    console.log('users', activeUsers)
    return (
      <div>
        <div className='header'>
        <div className='title'>Real-Time Chat Application</div>
          <Button color='inherit' onClick={this.logout}>Logout</Button>
        </div>

        <div className='container'>

          <div className='top'>
            <div className='name'>Welcome, {this.props.user}!</div>
            <div className='actions'>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={this.state.viewVideo} 
                    onChange={() => this.setState({ viewVideo: !this.state.viewVideo})}
                  />
                }
                label="View Video"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={this.state.shareVideo} 
                    onChange={() => this.setState({ shareVideo: !this.state.shareVideo})}
                  />
                }
                label="Share Video"
              />
            </div>
          </div>

          
          <div className='online'>
            {!activeUsers.length && (
              'Nobody else online right now!'
            )}
            {!!activeUsers.length && (
              `Other online users - ${activeUsers.join(', ')}`
            )}
          </div>

          <ChatComponent socket={this.socket} user={this.props.user} />


        </div>

        {/* <div>Logged in as {this.props.user}</div>
        <div>
          <span>Enter message</span>
          <input onChange={e => this.setState({message: e.target.value})}/>
        </div>
        
        <button onClick={this.sendMessage}>Send message</button>
        {(this.state.allMessages || []).map(message => 
          <div>{message}</div>)}

        <ViewVideo socket={this.socket}/>
        <img src={this.state.imageSrc}/> */}
      </div>
    )
  }
}

export default HomeComponent;