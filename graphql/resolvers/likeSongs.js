const checkAuth = require("../../common/utils/checkAuth");
const Song = require("../../models/Song");
const User = require("../../models/User");

module.exports = {
  Query: {
    async getLikeSongs(_, __, context) {
      try {
        const perticularUserLikeSongsList = [];
        const { id } = checkAuth(context);
        const user = await User.findById(id).populate("likeSongs");
        if (user) {
          const likeSonogList = await user.likeSongs;
          return likeSonogList;
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async addToLikeSongs(_, { songId }, context) {
      const { id } = checkAuth(context);
      try {
        const user = await User.findById(id);
        const song = await Song.findById(songId);
        if (!song) {
          throw new Error("Song not Found");
        }

        const songAlreayExistOnLikeSongs = await user.likeSongs.indexOf(songId);
        if (songAlreayExistOnLikeSongs > -1) {
          await user.likeSongs.splice(songAlreayExistOnLikeSongs, 1);
          await user.save();
          return "Song unLike";
        }

        const likeSongList = await user.likeSongs.push(songId);
        await user.save();
        if (likeSongList) {
          return "Song Like";
        }
        return "Something went wrong";
      } catch (err) {
        throw new Error("Error ", err);
      }
    },
  },
};
