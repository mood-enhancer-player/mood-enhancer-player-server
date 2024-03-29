const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    profileSrc: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type File {
    url: String!
  }

  type Song {
    _id: ID!
    name: String!
    description: String!
    singer: String!
    album: String!
    musicSrc: String!
    cover: String!
    playCount: Int!
    moodType: String!
    createdAt: String!
    updatedAt: String!
  }

  type Artist {
    _id: String!
    name: String!
    singerProfileFile: String!
  }

  input UpdateUserInput {
    username: String!
    email: String!
  }

  type Query {
    me: User
    getAllUsers: [User]!
    getPosts: [Post]
    getPost(postId: ID!): Post

    getSongById(songId: ID!): Song!
    getLikeSongs: [Song]!
    getRecentPlay: [Song!]!
    getAllSongs: [Song!]!
    getArtists: [Artist]!
    getAlbums: [Song]!
    getMostPopular: [Song!]!
    searchSong(songName: String, singerName: String): [Song]!
    getArtistById(artistId: ID!): Artist!
    getSongsByArtist(artistId: ID!): [Song]!
    getPlayList: [Song]!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    adminLogin(email: String!, password: String!): User!
    resetPassword(email: String): String!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!

    addToLikeSongs(songId: ID!): String!
    uploadSong(
      songFile: Upload!
      coverFile: Upload!
      name: String!
      description: String!
      album: String
      singer: String
    ): File!
    deleteSong(songId: ID!): String!
    addArtist(name: String!, singerProfileFile: Upload!): File!
    activeOrBlock: String!
    processImage(base64Image: Upload!): File!
    uploadProfile(profileImgFile: Upload!): File!
    uploadUserMoodImg(userMoodImgFile: Upload!): File!
    uploadModelInput(base64Image: Upload!): File!
    updateUserInfo(updateUserInput: UpdateUserInput): String!
  }
`;
