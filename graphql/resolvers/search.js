const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");

const checkAuth = require("../../common/utils/checkAuth");

const User = require("../../models/User");
const Song = require("../../models/Song");

module.exports = {
  Query: {
    async searchSong(_, { songName, singerName }, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          let songNameUppercase, singerNameUppercase, where;
          if (songName || singerName) {
            if (songName) {
              songNameUppercase = songName
                .trim()
                .replace(/\b\w/g, (c) => c.toUpperCase());
            }
            if (singerName) {
              singerNameUppercase = singerName
                .trim()
                .replace(/\b\w/g, (c) => c.toUpperCase());
            }

            const matchSongs = await Song.find({ name: songNameUppercase });
            const matchSingers = await Song.find({
              singer: singerNameUppercase,
            });
            if (matchSongs.length === 0 && matchSingers.length === 0) {
              return new UserInputError(
                "Song not found.Please search again with another keyword(songname or singer name)"
              );
            } else {
              return matchSongs.length ? matchSongs : matchSingers;
            }
          }
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
