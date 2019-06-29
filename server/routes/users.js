const express = require('express');
const User = require('../models/user');

const userRouter = express.Router();

userRouter.get('', (req, res) => {
  User.find({}).select({ "username": 1, "_id": 0})
    .then(comments => {
      res.send(comments);
    })
    .catch(err => {
      console.log('Something went wrong while fetching users: ', err);
      res.send(500);
    })
});

module.exports = userRouter;