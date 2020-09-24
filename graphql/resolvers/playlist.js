const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");

const checkAuth = require("../../common/utils/checkAuth");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../common/utils/validators");
const generateToken = require("../../common/utils/jwtGenerator");
const User = require("../../models/User");

module.exports = {
  Query: {
    async getPlayList(_, __, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id).populate("playList");
        if (user) {
          return user.playList;
          //   return [
          //     {
          //       title: "test title",
          //       album: "test album",
          //       songDuration: "test songSize",
          //       description: "test description",
          //       artist: "test artist",
          //       songDuration: "test songduration",
          //     },
          //     {
          //       title: "test title 2",
          //       album: "test album 2",
          //       songDuration: "test songSize 2",
          //       description: "test description 2",
          //       artist: "test artist 2",
          //       songDuration: "test songduration 2",
          //     },
          //   ];
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
      const user = await User.findById(id);

      const musicData = {
        title: "test title 2",
        album: "test album 2",
        songDuration: "test songSize 2",
        description: "test description 2",
        artist: "test artist 2",
        songDuration: "test songduration 2",
      };
      const res = await user.playList.push(songId);
      await user.save();
      //   console.log(user);
      if (res) {
        return "Song added into playlist sucessfully";
      }
      return "Something went wrong";
    },
  },
};
