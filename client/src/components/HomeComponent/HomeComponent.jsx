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
      imageSrc: {},
      shareVideo: false,
      viewVideo: false,
      allusers: [],
      videoUsers: [],
    }
  }

  componentDidMount() {
    this.socket = io.connect('', { query: `username=${this.props.user}`});

    this.socket.on('video', ({ image, user }) => {
      this.setState({ imageSrc: {
        ...this.state.imageSrc,
        [user]: image,
      }})
    });

    this.socket.emit('join');
    this.socket.on('user', (list) => {
      this.setState({
        allusers: list
      })
    });

    this.socket.on('video toggle', ({ videoUsers }) => {
      this.setState({ videoUsers });
    })

    this.socket.on('send message', ({ message }) => {
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

  getVideos = () => {
    const view = [];
    const { viewVideo, shareVideo, videoUsers } = this.state;
    if (shareVideo) {
      view.push(
        <ViewVideo socket={this.socket} user={'You'}/>
      )
    }

    if (viewVideo) {
      videoUsers
      .filter(u => u !== this.props.user)
      .forEach(u => (
        view.push(
          <div className='imageContainer'>
            <img src={this.state.imageSrc[u]} />
            <div>{u}</div>
          </div>
        )
      ))
    }

    return view;
  }

  render() {
    const activeUsers = this.getUserList();
    const { viewVideo, shareVideo } = this.state;
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
                    onChange={() => this.setState({ viewVideo: !this.state.viewVideo })}
                  />
                }
                label="View Video"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={this.state.shareVideo} 
                    onChange={() => {
                      this.socket.emit('video toggle', !this.state.shareVideo)
                      this.setState({ shareVideo: !this.state.shareVideo })
                    }}
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

          {(viewVideo || shareVideo) && (
            <div className='videoWrapper'>{this.getVideos()}</div>
          )}

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