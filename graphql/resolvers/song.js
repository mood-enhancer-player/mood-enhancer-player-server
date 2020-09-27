const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const { UserInputError } = require("apollo-server");

const checkAuth = require("../../common/utils/checkAuth");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../common/utils/validators");
const generateToken = require("../../common/utils/jwtGenerator");
const User = require("../../models/User");
const Song = require("../../models/Song");

module.exports = {
  Query: {
    async getAllSongs(_, __, context) {
      try {
        const { id } = checkAuth(context);
        console.log(id);
        const user = await User.findById(id);
        console.log(user);
        if (user) {
          const allSong = await Song.find({});
          return allSong;
        }
        return new Error("Song not found");
      } catch (err) {
        throw new Error(err);
      }
    },
    // uploads: () => {
    //   // Return the record of files uploaded from your DB or API or filesystem.
    //   return [
    //     {
    //       filename: "String",
    //       mimetype: "String",
    //       encoding: "String",
    //     },
    //   ];
    // },
  },
  Mutation: {
    // async uploadSong(_, { songData }, context) {
    //   try {
    //     const song = await Song.create(songData);
    //     console.log(song);
    //     await song.save();
    //     if (song) {
    //       return song;
    //     }
    //     return new Error("Song not uploaded");
    //   } catch (err) {
    //     throw new Error(err);
    //   }
    // },
    uploadSong: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const id = uuid.v4();
      const stream = createReadStream();
      const pathName = path.join(
        __dirname,
        `../../public/songs/${filename}${id}`
      );
      await stream.pipe(fs.createWriteStream(pathName));
      return {
        url: `http://localhost:9090/songs/${filename}${id}`,
      };
    },
    // 1. Validate file metadata.

    // 2. Stream file contents into cloud storage:
    // https://nodejs.org/api/stream.html

    // 3. Record the file upload in your DB.
    // const id = await recordFile( … )
  },
};
