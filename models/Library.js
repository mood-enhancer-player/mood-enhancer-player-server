const { model, Schema } = require("mongoose");
const { songSchema } = require("./Song");

const librarySchema = new Schema(
  {
    playlist: [songSchema],
    podcast: [songSchema],
    artistname: [songSchema],
    albums: [songSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Library", librarySchema);
