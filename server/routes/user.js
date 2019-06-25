const express = require('express');
const User = require('../models/user');

const userRouter = express.Router();

userRouter.get('/u', (req, res) => res.send('hello'))

userRouter.post("", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('got post', username, password, req.body);

    const newUser = new User({ username, password });
    req.session.user = { userId: newUser.id, username };
    console.log('session', req.session);
    await newUser.save();
    res.send({ userId: newUser.id, username });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = userRouter;