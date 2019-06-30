const express = require('express');
const User = require('../models/user');

module.exports = function sessionRouter(activeUsers) {

  const sessionRouter = express.Router();

  // login user, save session 
  sessionRouter.put('', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    try {
      if (user && user.comparePasswords(password)) {
        const sessionInfo = {
          userId: user.id,
          username: user.username
        };
        req.session.user = sessionInfo;
        res.send(sessionInfo);
        activeUsers.push(username);
      } else {
        res.status(401).send('Invalid');
      }
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // logout user
  sessionRouter.delete('', (req, res) => {
    try {
      const user = req.session.user;
      if (user) {
        req.session.destroy(err => {
          if (err) throw (err);
          res.clearCookie('mysession');
          res.send(user);
        });
      } else {
        throw new Error('Something went wrong');
      }
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // sign up user and save to session
  sessionRouter.post('', async (req, res) => {
    try {
      const { username, password } = req.body;
      const newUser = new User({ username, password });

      await newUser.save();
      req.session.user = { userId: newUser.id, username };
      res.send({ userId: newUser.id, username });
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // check if user is logged in
  sessionRouter.get('', (req, res) => {
    res.send({
      user: req.session.user
    })
  });

  return sessionRouter;

}

