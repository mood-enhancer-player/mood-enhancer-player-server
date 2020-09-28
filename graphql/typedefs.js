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
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  input SongInput {
    title: String!
    description: String!
    artist: String!
    songDuration: String!
    album: String!
    songFile: String!
  }

  type Song {
    title: String!
    description: String!
    artist: String!
    songDuration: String!
    album: String!
    songURL: String!
    playCount: Int!
  }

  # type Playlist {
  #   title: String!
  #   album: String!
  #   songSize: String!
  # }

  # type File {
  #   filename: String!
  # }

  type File {
    url: String!
  }

  type Query {
    me: User
    getPosts: [Post]
    getPost(postId: ID!): Post

    getSongById(songId: ID!): Song!
    getPlayList: [Song]!
    getRecentPlay: [Song!]!
    getAllSongs: [Song!]!
    getArtists: [String]!
    getAlbums: [String]!
    getMostPopular: [Song!]!
    # uploads: [File]
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!

    addToPlayList(songId: ID!): String!
    # uploadSong(songData: SongInput!): Song!
    uploadSong(file: Upload!): File!
  }

  # type Subscription {
  #   newPost: Post!
  # }
`;
