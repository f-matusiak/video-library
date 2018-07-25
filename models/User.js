const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
  }],
});

UserSchema.pre('save', function (next) {
  if (this.isNew) {
    bcrypt.hash(this.hash, 10)
      .then((hash) => {
        this.hash = hash;

        next();
      });

  } else {
    next();
  }
});

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.hash);
}

UserSchema.methods.favorite = function (id) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites.push(id);
  }

  return this.save();
}

UserSchema.methods.unFavorite = function (id) {
  this.favorites.remove(id);
  return this.save();
}

UserSchema.methods.generateJWT = function () {
  const payload = {
    id: this._id,
    username: this.username
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24
  });
}


module.exports = mongoose.model('User', UserSchema);