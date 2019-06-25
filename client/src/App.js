import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
      <div className="App">
        <h1>Welcome!</h1>
        <Link to='/login'>Login</Link>
        <Link to='/signup'>Signup</Link>
        <Link to='/dashboard'>Dashboard</Link>
      </div>
    );
  }
}

export default App;