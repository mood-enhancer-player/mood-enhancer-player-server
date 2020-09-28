const checkAuth = require("../../common/utils/checkAuth");
const Song = require("../../models/Song");
const User = require("../../models/User");

module.exports = {
  Query: {
    async getPlayList(_, __, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id).populate("playList");
        if (user) {
          console.log(user.playList);
          return user.playList;
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async addToPlayList(_, { songId }, context) {
      const { id } = checkAuth(context);
      try {
        const user = await User.findById(id);
        const song = await Song.findById(songId);
        if (!song) {
          throw new Error("Song not Found");
        }

        const songAlreayExistOnPlaylist = await user.playList.indexOf(songId);
        if (songAlreayExistOnPlaylist > -1) {
          await user.playList.splice(songAlreayExistOnPlaylist, 1);
          await user.save();
          return "Song is removed from playlist";
        }

        const songPlayList = await user.playList.push(songId);
        await user.save();
        if (songPlayList) {
          return "Song added into playlist sucessfully";
        }
        return "Something went wrong";
      } catch (err) {
        throw new Error("Error ", err);
      }
    },
  },
};
