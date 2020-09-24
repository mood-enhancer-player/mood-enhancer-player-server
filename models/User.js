const { model, Schema } = require("mongoose");
const { songSchema } = require("./Song");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    playlist: [songSchema],
    podcast: [songSchema],
    artists: [songSchema],
    albums: [songSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
