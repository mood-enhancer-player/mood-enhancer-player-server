const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const { UserInputError } = require("apollo-server");

const checkAuth = require("../../common/utils/checkAuth");

const User = require("../../models/User");
const Song = require("../../models/Song");

module.exports = {
  Query: {
    async getAllSongs(_, __, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          const allSong = await Song.find({});
          return allSong;
        }
        return new Error("Song not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    uploadSong: async (_, { file }, context) => {
      const { id } = checkAuth(context);
      const { createReadStream, filename, mimetype, encoding } = await file;

      const songId = uuid.v4();
      const stream = createReadStream();
      const pathName = path.join(
        __dirname,
        `../../public/songs/${filename + songId}`
      );
      await stream.pipe(fs.createWriteStream(pathName));

      const songData = {
        title: "title",
        description: "description",
        artist: "artist",
        songDuration: "duration",
        album: "albumname",
        songURL: `http://localhost:9090/songs/${filename + songId}`,
        userId: id,
      };

      try {
        const song = await Song.create(songData);
        await song.save();
        if (song) {
          return {
            url: `http://localhost:9090/songs/${filename + songId}`,
          };
        }
        return new Error("Song not uploaded");
      } catch (err) {
        throw new Error(err);
      }
    },
    // 1. Validate file metadata.

    // 2. Stream file contents into cloud storage:
    // https://nodejs.org/api/stream.html

    // 3. Record the file upload in your DB.
    // const id = await recordFile( … )
  },
};
