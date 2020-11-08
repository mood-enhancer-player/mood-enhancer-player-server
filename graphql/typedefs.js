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

  # input SongInput {
  #   title: String!
  #   description: String!
  #   artist: String!
  #   # songDuration: String!
  #   album: String!
  #   # songFile: String!
  # }

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

  type Song {
    _id: ID!
    name: String!
    description: String!
    singer: String!
    album: String!
    musicSrc: String!
    cover: String!
    playCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Artist {
    _id: String!
    name: String!
    singerProfileFile: String!
  }

  # input SearchInput {
  #   songName: String!
  #   singerName: String!
  # }

  type Query {
    me: User
    getAllUsers: [User]!
    getPosts: [Post]
    getPost(postId: ID!): Post

    getSongById(songId: ID!): Song!
    getPlayList: [Song]!
    getRecentPlay: [Song!]!
    getAllSongs: [Song!]!
    getArtists: [Artist]!
    getAlbums: [Song]!
    getMostPopular: [Song!]!
    searchSong(songName: String, singerName: String): [Song]!
    # uploads: [File]
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!

    addToPlayList(songId: ID!): String!
    # uploadSong(songData: SongInput!): Song!
    # uploadSong(file: Upload!, songInput: SongInput): File!
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
  }

  # type Subscription {
  #   newPost: Post!
  # }
`;
