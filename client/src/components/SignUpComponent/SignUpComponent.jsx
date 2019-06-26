import React from 'react';
import './SignUpComponent.css';

class SignUpComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmpassword: '',
    }
  }

  render() {
    return (
      <div className='blue'>signup</div>
    )
  }
}

export default SignUpComponent;