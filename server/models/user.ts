import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  pinfo: {
    username: String,
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: String,
    role: String,
    status: Boolean,
    verify: Boolean,
    deleted: Boolean,
    phoneno: String,
    address: String,
    dob: String

  },

  skills: [{
    name: String,
    experience: Number
  }],

  educations: [{
    degreename: String,
    subject: String,
    institution: String,
    completionyear: String,
    percentage: String

  }],

  jobhistories: [{
    orgname: String,
    desg: String,
    dur: String

  }],

  docs: [{
    path: String,
    name: String,
    type: String
  }]
}
);

// Before saving the user, hash the password
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('pinfo.password')) { return next(); }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(user.pinfo.password, salt, function (error, hash) {
      if (error) { return next(error); }
      user.pinfo.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.pinfo.password, function (err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};

// Omit the password when returning a user
userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
