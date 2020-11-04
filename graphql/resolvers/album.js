const checkAuth = require("../../common/utils/checkAuth");
const Song = require("../../models/Song");
const User = require("../../models/User");

module.exports = {
  Query: {
    async getAlbums(_, __, context) {
      try {
        const perticularUserAlbums = [];
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          const allSongs = await Song.find({});
          allSongs.forEach((song) => {
            if (user.albums.includes(song.album)) {
              perticularUserAlbums.push(song);
            }
          });
          return perticularUserAlbums;
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
