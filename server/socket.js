const Comment = require('./models/comments');
const getEmotion = require('./utils/emotion');

module.exports = function socket(io, activeUsers) {
  return function (socket) {

    const username = socket.handshake.query.username;
    console.log(`${username} connected!`);
    if (activeUsers.indexOf(username) < 0) {
      activeUsers.push(socket.handshake.query.username);
      io.emit('send message', { username: 'admin', message: `${username} joined.`});
    }
    
    // handle disconnect
    socket.on('disconnect', () => {
      console.log(`${username} disconnected`);
      const index = activeUsers.indexOf(username);
      if (index > -1) {
        activeUsers.splice(index, 1);
        console.log('called disconnect');
        io.emit('send message', { username: 'admin', message: `${username} left chat.`});
      };
    });
  
    // receive message. find out emotion. broadcast (message + emotion) to all active users and also archive in db
    socket.on('send message', async ({ message, username }) => {
      console.log('message received', message, 'from user', username);
      io.emit('send message', { message, username }); // broadcast message

      let emotion = await getEmotion(message);
      
      console.log('emotion', emotion);

      const newComment = new Comment({
        username, message, emotion: 'neutral'
      });
      newComment.save();
    });

    // video handler
    socket.on('video', (image) => {
      // console.log('video', image)
      socket.broadcast.emit('video', image)
    })
  }
}