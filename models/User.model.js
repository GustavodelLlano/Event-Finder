const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'You need to introduce your username']
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'You need to introduce your email']
    },
    passwordHash: {
      type: String,
      required: [true, 'You need to introduce a password']
    },
    profileImg: {
      type: String,
      default: 'https://i.stack.imgur.com/l60Hf.png'
    },
    description: {
      type: String,
      default: 'No existe descripción.'
    },
    role: {
      type: String,
      enum: ["USER", "ARTIST", "ADMIN"],
      default: 'USER'
    },
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    wishEvents: {
      apiEvents: [String],
      internalEvents: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
      }]
    },
    artistEvents: {
      apiEvents: [String],
      internalEvents: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
      }]
    },
    attendedEvents: {
      apiEvents: [String],
      internalEvents: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
      }]
    }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
