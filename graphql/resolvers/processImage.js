// const path = require("path");
const { extname, resolve } = require("path");
const fs = require("fs");
const AWS = require("aws-sdk");

// const uuid = require("uuid");
const { v4: uuid } = require("uuid");

const { UserInputError } = require("apollo-server");

const checkAuth = require("../../common/utils/checkAuth");

const User = require("../../models/User");
const Song = require("../../models/Song");

module.exports = {
  Mutation: {
    async processImage(_, { base64Image }, context) {
      console.log("base64", base64Image);
      // try {
      //   const { id } = checkAuth(context);
      //   const user = await User.findById(id);
      //   if (user) {
      //     return "playlist";
      //   }
      //   return new Error("User not found");
      // } catch (err) {
      //   throw new Error(err);
      // }
      return { url: "hello" };
    },
  },
};
