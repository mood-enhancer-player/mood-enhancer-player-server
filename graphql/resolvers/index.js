const usersResolvers = require("./user");
const likeSongsResolvers = require("./likeSongs");
const songResolvers = require("./song");
const artistResolvers = require("./artist");
const albumResolvers = require("./album");
const searchResolver = require("./search");
const moodResolver = require("./mood");
const modelInputResolver = require("./modelInput");
const mood = require("./mood");

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...likeSongsResolvers.Query,
    ...songResolvers.Query,
    ...artistResolvers.Query,
    ...albumResolvers.Query,
    ...searchResolver.Query,
  },

  Mutation: {
    ...usersResolvers.Mutation,
    ...likeSongsResolvers.Mutation,
    ...songResolvers.Mutation,
    ...artistResolvers.Mutation,
    ...moodResolver.Mutation,
    ...modelInputResolver.Mutation,
  },

  // Subscription: {
  //   ...postsResolvers.Subscription,
  // },
};
