const express = require('express');
const session = require('express-session');
const connectStore = require('connect-mongo');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;
const path = require('path');

const userRouter = require('./routes/user');
const sessionRouter = require('./routes/session');
const MongoStore = connectStore(session);

(async () => {
  try {
    await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
    console.log('MongoDB connected');

    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(session({
      name: 'mysession',
      secret: '1879',
      saveUninitialized: false,
      resave: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: 'session',
        ttl: 3600
      }),
      cookie: {
        sameSite: true,
        secure: false,
        maxAge: 3600000
      }
    }));

    const apiRouter = express.Router();
    app.use('/api', apiRouter);

    apiRouter.use('/session', sessionRouter); // handle session routing
    apiRouter.use('/users', userRouter);      // handle user routes

    app.use(express.static(path.join(__dirname, '../client/build')))

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname + '/../client/build/index.html'))
    })

    app.listen(port, () => console.log(`App listening on port ${port}`));
  } catch (err) {
    console.error(err);
  }
})();


// mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// const Schema = mongoose.Schema;
// const userSchema = new Schema({
//   a: String,
//   b: String,
// });
// var SomeModel = mongoose.model('SomeModel', userSchema );

// var awesome_instance = new SomeModel({ a: 'awesome' });

// // Save the new model instance, passing a callback
// awesome_instance.save(function (err) {
//   if (err) return handleError(err);
//   // saved!
// });



// app.get('/express', (req, res) => {
//   res.send({ express: 'Hello' });
// });

// app.use(express.static(path.join(__dirname, '../client/build')))


// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/../client/build/index.html'))
// })

// app.listen(port, () => console.log(`Listening on port ${port}`));