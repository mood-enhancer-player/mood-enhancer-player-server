const checkAuth = require("../../common/utils/checkAuth");
const Song = require("../../models/Song");
const User = require("../../models/User");

module.exports = {
  Query: {
    async getArtists(_, __, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          console.log(user.artists);
          return user.artists;
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
