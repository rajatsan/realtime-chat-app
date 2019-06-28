const express = require('express');
const Comment = require('../models/comments');

const commentRouter = express.Router();

commentRouter.get('', (req, res) => {
  Comment.find({}, (err, comments) => {
    res.send(comments);
  });
});

module.exports = commentRouter;