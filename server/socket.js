const Comment = require('./models/comments');
const getEmotion = require('./utils/emotion');


module.exports = function socketHandler(io, activeUsers) {
  return function (socket) {

    const username = socket.handshake.query.username;
    
    socket.on('join', () => {
      console.log(`${username} joined!`, activeUsers);
      if (activeUsers.indexOf(username) < 0) {
        console.log('new active in join', activeUsers)
        activeUsers.push(username);
      };
      io.emit('send message', { username: 'admin', message: `${username} joined.`});
      io.emit('user', activeUsers); // send to all connected clients
    })

    socket.on('leave', () => {
      console.log(`${username} left!`);
      if (activeUsers.indexOf(username) > -1) {
        activeUsers.splice(activeUsers.indexOf(username), 1);
      };
      socket.broadcast.emit('send message', { username: 'admin', message: `${username} left.`});
      socket.broadcast.emit('user', activeUsers); // send to all connected clients
    })
  
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