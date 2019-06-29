import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import { headers, sessionApi } from '../../api';
import './LoginComponent.css';

const initialState = {
  username: '',
  password: '',
  confPassword: '',
  signup: false,
  userError: '',
  passwordError: '',
  confirmError: '',
  notification: '',
}

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleInput = field => e => {
    this.setState({
      [field]: e.target.value
    });

    if (field === 'username') {
      this.validateUsername(e.target.value)
    }
  }

  validateUsername = (username, onsubmit = false) => {
    if (!username) {
      this.setState({ userError: 'Username is required!'});
      return false;
    };

    if (this.props.users.indexOf(username.toLowerCase()) > -1 && this.isNew()) {
      this.setState({ userError: 'This username is already taken!' });
      return false;
    }

    if (this.props.users.indexOf(username.toLowerCase()) < 0 && !this.isNew() && onsubmit) {
      this.setState({ userError: 'Username not found!' });
      return false;
    }

    this.setState({ userError: '' });
    return true;
  }

  validatePassword = () => {
    if (!this.state.password) {
      this.setState({ passwordError: 'Password is required!' });
      return false;
    }
    if (this.state.password.length < 4) {
      this.setState({ passwordError: 'Password should be at least 4 characters long.' });
      return false;
    }

    this.setState({ passwordError: '' })
    return true;
  }

  validateConfirmPassword = () => {
    if (!this.state.confPassword) {
      this.setState({ confirmError: 'Password is required!' });
      return false;
    }
    if (this.state.password !== this.state.confPassword) {
      this.setState({ confirmError: 'Passwords do not match!' });
      return false;
    };
    this.setState({ confirmError: '' })
    return true;
  }

  login = async () => {
    const { username, password } = this.state;

    const u = this.validateUsername(this.state.username, true);
    const p = this.validatePassword();
    if (!u || !p) return;

    try {
      const res = await fetch(sessionApi, {
        method: 'put',
        body: JSON.stringify({ username, password }),
        headers
      });
      const user = await res.json();
      this.props.onLogin(user.username);
      this.setState({ notification: 'Login successful!' });
    } catch {
      this.setState({
        passwordError: 'Password is invalid!',
      })
    }
  }

  signup = () => {
    const u = this.validateUsername(this.state.username, true);
    const p = this.validatePassword();
    const c = this.validateConfirmPassword();
    if (!(u && c && p)) return;

    const { username, password } = this.state;
    fetch(sessionApi, {
      method: 'post',
      body: JSON.stringify({ username, password }),
      headers
    })
    .then(r => {
      if (r.status == 200) {
        this.setState({ ...initialState, signup: false, notification: 'Signup successful!' });
        this.props.fetchUsers();
      } else {
        this.setState({ userError: 'This username is already taken!'})
      }
    });
  }

  isNew = () => {
    return this.state.signup
  }

  toggle = () => {
    this.setState({ ...initialState, signup: !this.state.signup }, console.log(this.state))
  }

  render() {
    const isNew = this.isNew();
    return (
      <div>
        <div className='header'>
          <div className='title'>Real-Time Chat Application</div>
        </div>
        <div className='form'>
          <TextField
            error={this.state.userError !== ''}
            label="Username"
            onChange={this.handleInput('username')}
            margin="normal"
            variant="outlined"
            helperText={this.state.userError}
            value={this.state.username}
          />
          <TextField
            label="Password"
            error={this.state.passwordError !== ''}
            type="password"
            margin="normal"
            variant="outlined"
            onChange={this.handleInput('password')}
            helperText={this.state.passwordError}
            value={this.state.password}
          />

          {isNew && (
            <TextField
              label="Confirm Password"
              type="password"
              margin="normal"
              variant="outlined"
              onChange={this.handleInput('confPassword')}
              helperText={this.state.confirmError}
              error={this.state.confirmError !== ''}
              value={this.state.confPassword}
            />
          )}
            
            <Button 
              variant='contained' 
              color='primary' 
              onClick={isNew ? this.signup : this.login}
              style={{ 
                width: '120px',
                marginTop: '10px',
                marginBottom: '30px'
              }}
            >
              {!isNew ? 'Login' : 'Signup'}
            </Button>

            <div className='footer'>
              {this.isNew() ? 'Existing' : 'New'} user?
              <Button 
                color='secondary'
                variant='outlined'
                style={{
                  marginLeft: '10px',
                }}
                onClick={this.toggle}
              >
                {isNew ? 'Login' : 'Signup'}
              </Button>
            </div>
          </div>
          <Snackbar
            open={this.state.notification !== ''}
            autoHideDuration={6000}
            onClose={() => this.setState({ notification: '' })}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={
              <span id="message-id">{this.state.notification}</span>
            }
          />
      </div>
      )
  }
}

export default LoginComponent;