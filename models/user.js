const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      // unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      // unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true,
    },
    bg_collection: {
      type: [String],
      default: [],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: true,
  }
);

userSchema.pre("save", async function save(next) {
  if(!this.isNew || !this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
  } catch (error) {
    next(error)
  }
})

// Initialize our User model
const user = model('user', userSchema);

module.exports = user;