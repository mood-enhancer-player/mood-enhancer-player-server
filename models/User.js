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
    playList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
        require: true,
      },
    ],
    artists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
        require: true,
      },
    ],
    albums: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
        require: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
