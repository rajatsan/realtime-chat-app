const User = require('../models/user');

module.exports = function (req, res, next) {
  console.log('checking auth', req.session);
  try {
    if (!req.session.user || req.session.user.userId === null) {
      const err = new Error('Unauthorized!');
      err.status = 400;
      return next(err);
    } else {
      return next();
    }
  } catch (err) {
    throw err;
  }
};