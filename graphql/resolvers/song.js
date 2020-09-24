const bcrypt = require("bcryptjs");
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
  },
  Mutation: {
    async uploadSong(_, { songData }, context) {
      try {
        const song = await Song.create(songData);
        console.log(song);
        await song.save();
        if (song) {
          return song;
        }
        return new Error("Song not uploaded");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
