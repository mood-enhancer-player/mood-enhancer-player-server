const { model, Schema } = require("mongoose");

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
    profileSrc: {
      type: String,
      required: true,
      default: "https://www.w3schools.com/howto/img_avatar.png",
    },
    faceSrc: {
      type: String,
      required: true,
      default: "https://pngimg.com/uploads/face/face_PNG11760.png",
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
    likeSongs: [
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
    status: {
      type: String,
      required: true,
      default: "active",
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
