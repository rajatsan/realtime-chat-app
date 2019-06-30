import React from 'react';

import './ViewVideoComponent.css';

class ViewVideoComponent extends React.Component {

  handleVideo = (stream) => {
    this.stream = stream;
    const video = document.querySelector('video');
      video.srcObject = stream;
      video.onloadedmetadata = function(e) {
        video.play();
      }; 
  }

  videoSuccess = (stream) => {
    this.handleVideo(stream);

      // send image
      const canvas = document.querySelector('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 250;
      canvas.height = 200;

      context.width = canvas.width;
      context.height = canvas.height;

      setInterval(() => {
        context.drawImage(this.video,0,0,context.width,context.height);
        if (this.props.socket)
          this.props.socket.emit('video', canvas.toDataURL('image/webp'));
      },5);
  }

  videoError = (err) => {
    console.log('got error', err);
  }

  componentDidMount = () => {
    this.video = document.querySelector('video');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true}).then(stream => 
        this.videoSuccess(stream)
      );
    } else {
      navigator.getUserMedia({video: true}).then(stream => this.videoSuccess(stream))
    }
  }

  componentWillUnmount() {
    if (this.video) {
      this.video.pause();
      this.video.src = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }
  }

  render() {
    return (
      <div className='videoContainer'>
        <video autoPlay={true}/>
        <div>{this.props.user}</div>
        <canvas />
      </div>
    )
  }
}

export default ViewVideoComponent;