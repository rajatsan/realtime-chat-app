import React from 'react';

import { headers, sessionApi } from '../../api';
import './LoginComponent.css';

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confPassword: '',
      signup: false
    }
  }

  handleInput = field => e => {
    this.setState({
      [field]: e.target.value
    })
  }

  login = async () => {
    const { username, password } = this.state;

    try {
      const res = await fetch(sessionApi, {
        method: 'put',
        body: JSON.stringify({ username, password }),
        headers
      });
      const user = await res.json();
      this.props.onLogin(user.username);
    } catch {
      console.log('username/password is invalid')
    }
  }

  signup = () => {
    const { username, password, confPassword } = this.state;

    if (username !== confPassword) {
      console.error('passwords do not match');
    }

    fetch(sessionApi, {
      method: 'post',
      body: JSON.stringify({ username, password }),
      headers
    })
    .then(r => {
      if (r.status == 200) {
        // signup successfull, go to login
        this.setState({ signup: false });
      } else {
        // user already exists perhaps
        console.error('already exists')
      }
    });
  }

  renderLogin = () => (
    <div>
      <div>Login</div>
      <div>
        Username<input onChange={this.handleInput('username')}/>
      </div>
      <div>
        Password<input onChange={this.handleInput('password')}/>
      </div>
      <button onClick={this.login}>Login</button>
      <hr />
      <div>New user? </div>
      <button onClick={() => this.setState({ signup: true })}>Signup </button>
    </div>
  )
  

  renderSignUp = () => (
    <div>
      <div>Signup</div>
      <div>
        Username<input onChange={this.handleInput('username')}/>
      </div>
      <div>
        Password<input onChange={this.handleInput('password')}/>
      </div>
      <div>
        Confirm Password<input onChange={this.handleInput('confPassword')}/>
      </div>
      <button onClick={this.signup}>Signup</button>
      <hr />
      <div>Existing user? </div>
      <button onClick={() => this.setState({ signup: false })}>Login </button>
    </div> 
  )

  render() {
    return (
      <div>
        {this.state.signup ? 
          this.renderSignUp()
          :
          this.renderLogin()
        }
        <div className="test">Kaljsdlkfjlak;sdfK</div>
      </div>
    )
  }
}

export default LoginComponent;