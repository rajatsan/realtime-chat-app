const express = require('express');
const User = require('../models/user');

const userRouter = express.Router();

userRouter.get('/u', (req, res) => res.send('hello'))



module.exports = userRouter;