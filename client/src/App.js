import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import SignUpComponent from './components/SignUpComponent';
import LoginComponent from './components/LoginComponent';
import HomeComponent from './components/HomeComponent';

class App extends Component {
state = {
    data: null
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
  
  callBackendAPI = async () => {
    const response = await fetch('/express');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={HomeComponent} />
          <Route path="/signup" component={SignUpComponent} />
          <Route path="/login" component={LoginComponent} />
        </div>
      </Router>
    );
  }
}

export default App;