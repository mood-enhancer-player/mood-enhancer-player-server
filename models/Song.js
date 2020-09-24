const { model, Schema } = require("mongoose");

const songSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    songDuration: {
      type: String,
      required: true,
      trim: true,
    },
    album: {
      type: String,
      required: true,
      trim: true,
    },
    songFile: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Song", songSchema);
