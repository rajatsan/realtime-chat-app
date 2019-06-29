const express = require('express');
const session = require('express-session');
const connectStore = require('connect-mongo');
const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoStore = connectStore(session);

const port = process.env.PORT || 5000;
const path = require('path');

const sessionRouter = require('./routes/session');
const commentsRouter = require('./routes/comments');
const auth = require('./utils/auth');
const commentsSocket = require('./socket');

const activeUsers = []; // list of users connected to chat room

SESSION_SECRET = process.env.SESSION_SECRET;
SESSION_NAME = process.env.SESSION_NAME;
MONGO_PWD = process.env.MONGO_PWD;

(async () => {
  try {
    await mongoose.connect(`mongodb+srv://rajat:${MONGO_PWD}@cluster0-mynue.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true });
    console.log('MongoDB connected');
    
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(session({
      name: SESSION_NAME,
      secret: SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: 'session',
        ttl: 36000
      }),
      cookie: {
        sameSite: true,
        secure: false,
        maxAge: 36000000
      }
    }));

    const apiRouter = express.Router();
    app.use('/api', apiRouter);

    apiRouter.use('/session', sessionRouter); // handle session routing
    apiRouter.use(auth);                      // handle auth. Throws 401 if user is not logged in
    apiRouter.get('/activeUsers', (_, res) => res.send(activeUsers));
    apiRouter.use('/comments', commentsRouter);

    io.on('connection', commentsSocket(io, activeUsers));  // handle comments socket connection

    app.use(express.static(path.join(__dirname, '../client/build')))

    // 404 handler
    app.use(function (req, res, next) {
      res.status(404).send('Not found!')
    });

    // error handler
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.send(err.message);
    });

    http.listen(port, () => console.log(`App listening on port ${port}`));
  } catch (err) {
    console.error(err);
  }
})();

module.exports = io;