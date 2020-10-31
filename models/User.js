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
    recentPlay: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
        require: true,
      },
    ],
    playList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
        require: true,
      },
    ],
    singers: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    albums: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
