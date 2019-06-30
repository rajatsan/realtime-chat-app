const Comment = require('./models/comments');
const getEmotion = require('./utils/emotion');

module.exports = function socket(io, activeUsers) {
  return function (socket) {

    const username = socket.handshake.query.username;
    console.log(`${username} connected!`);
    if (activeUsers.indexOf(username) < 0) {
      activeUsers.push(username);
      socket.broadcast.emit('send message', { username: 'admin', message: `${username} joined.`});
      io.emit('user', activeUsers); // send to all connected clients
    }
    
    // handle disconnect
    socket.on('disconnect', () => {
      console.log(`${username} disconnected`);
      if (activeUsers.indexOf(username) > -1) {
        activeUsers.splice(activeUsers.indexOf(username), 1);
        io.emit('user', activeUsers);
        socket.broadcast.emit('send message', { username: 'admin', message: `${username} left chat.`});
      }      
    });
  
    // receive message. find out emotion. broadcast (message + emotion) to all active users and also archive in db
    socket.on('send message', async ({ message, username }) => {
      console.log('message received', message, 'from user', username);
      const emotion = await getEmotion(message);
      io.emit('send message', { message, username, emotion }); // send to all connected clients

      const newComment = new Comment({
        username, message, emotion: 'neutral'
      });
      newComment.save();
    });

    // video handler
    socket.on('video', (image) => {
      socket.broadcast.emit('video', image) // send to all cliente except sender
    })
  }
}