const express = require('express');
const User = require('../models/user');

const sessionRouter = express.Router();

// login user, save session 
sessionRouter.post('', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && user.comparePasswords(password)) {
    const sessionInfo = {
      userId: user.id,
      username: user.username
    };
    req.session.user = sessionInfo;
    res.send(sessionInfo);
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
    res.status(400).send(parseError(err));
  }
});

// check if user is logged in
sessionRouter.get('', (req, res) => {
  res.send({
    user: req.session.user
  })
});

module.exports = sessionRouter;

