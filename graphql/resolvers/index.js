// const postsResolvers = require("./post");
const usersResolvers = require("./user");
// const commentsResolvers = require("./comments");
// const likesResolvers = require("./likes");
const playlistResolvers = require("./playlist");
const songResolvers = require("./song");
const artistResolvers = require("./artist");
const albumResolvers = require("./album");
const searchResolver = require("./search");

module.exports = {
  // Post: {
  //   likeCount: (parent) => parent.likes.length,
  //   commentCount: (parent) => parent.comments.length,
  // },

  Query: {
    // ...postsResolvers.Query,
    ...usersResolvers.Query,
    ...playlistResolvers.Query,
    ...songResolvers.Query,
    ...artistResolvers.Query,
    ...albumResolvers.Query,
    ...searchResolver.Query,
  },

  Mutation: {
    ...usersResolvers.Mutation,
    ...playlistResolvers.Mutation,
    ...songResolvers.Mutation,
    // ...postsResolvers.Mutation,
    // ...commentsResolvers.Mutation,
    // ...likesResolvers.Mutation,
  },

  // Subscription: {
  //   ...postsResolvers.Subscription,
  // },
};
