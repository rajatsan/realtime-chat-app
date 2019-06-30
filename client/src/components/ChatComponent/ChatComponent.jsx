import React from 'react';
import io from 'socket.io-client';

import './ChatComponent.css';
const emojis = ['😂', '😄', '😜', '😛', '❤️️', '😔', '😆', '😐', '😕', '😶', '😑', '🙁'];

class ChatComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      text: '',
    }
  }

  componentDidMount() {
    this.socket = io.connect('', { query: `username=${this.props.user}`});
    this.socket.on('send message', ({ message, username, emotion }) => {
      this.setState({
        messages: this.state.messages.concat([{
          message, username, emotion
        }])
      });
    })
  }

  keyDown = e => {
    if (e.keyCode === 13) {
      this.sendMessage();
      e.preventDefault();
    }
  }

  getUser = (u) => {
    if (u === this.props.user) {
      return 'You';
    }
    return u;
  }

  getEmotion = (text) => {
    switch (text) {
      case 'positive':
        return ':)'
      case 'negative':
        return ':('
      default:
        return ':|'
    }
  }

  sendMessage = () => {
    if (this.state.text === '') return;
    this.socket.emit('send message', {
      message: this.state.text,
      username: this.props.user,
    });
    this.setState({ text: '' });
  }

  handleTextChange = (e) => {
    this.setState({ text: e.target.value })
  }

  render() {
    return (
      <div style={{ paddingBottom: '80px' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>User</th>
              <th style={{ width: '70%' }}>Message</th>
              <th style={{ width: '15%' }}>Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {this.state.messages.map((e, index) => (
              <tr key={index}>
                <td>{this.getUser(e.username)}</td>
                <td>{e.message}</td>
                <td>{this.getEmotion(e.emotion)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='message'>
          <textarea
            value={this.state.text}
            onKeyDown={this.keyDown}
            onChange={this.handleTextChange}
          />
          <div className='send' onClick={this.sendMessage}>SEND</div>
        </div>

        <div className='emoji'>
        {emojis.map(e => 
          <span onClick={() => {
            this.setState({
              text: this.state.text + e
            })
          }}>{e}
          </span>
        )}
        </div>
      </div>
    )
  }
}

export default ChatComponent;