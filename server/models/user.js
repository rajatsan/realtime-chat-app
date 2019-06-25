const mongoose = require('mongoose');
const { compareSync, hashSync } = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    validate: {
      validator: username => User.doesNotExist({ username }),
      message: "Username already exists"
    },
    required: true,
  }, 
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true});

UserSchema.pre('save', function () {
  if (this.isModified('password')) {
    this.password = hashSync(this.password);
  }
});

UserSchema.statics.doesNotExist = async function (field) {
  return await this.where(field).countDocuments() === 0;
};

UserSchema.methods.comparePasswords = function (password) {
  return compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;