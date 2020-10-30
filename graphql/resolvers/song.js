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
const { rejects } = require("assert");

// const s3 = require("./aws/s3");

module.exports = {
  Query: {
    async getSongById(_, { songId }, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          const song = await Song.findById(songId);
          if (song) {
            // Increase playCount by 1
            song.playCount = song.playCount + 1;
            await song.save();
            // artist added
            const artistAlreadyExist = user.artists.includes(song.artist);
            if (!artistAlreadyExist) {
              await user.artists.unshift(song.artist);
            }
            // album added
            const albumAlreadyExist = user.albums.includes(song.album);
            if (!albumAlreadyExist) {
              await user.albums.unshift(song.album);
            }
            await user.save();
            // song is added to recentPlay
            const recentSongExist = user.recentPlay.includes(songId);
            if (!recentSongExist) {
              await user.recentPlay.unshift(songId);
              await user.save();
            }
            return song;
          } else {
            throw new UserInputError("Song not found");
          }
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
    async getRecentPlay(_, __, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id).populate("recentPlay");
        if (user) {
          return user.recentPlay;
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
    async getMostPopular(_, __, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          const mostPopular = await Song.find()
            .limit(3)
            .sort({ playCount: -1 });
          return mostPopular;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getAllSongs(_, __, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          const allSongs = await Song.find({});
          return allSongs;
        }
        return new Error("Songs not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    uploadSong: async (_, { file }, context) => {
      const { id } = checkAuth(context);
      const { createReadStream, filename, mimetype, encoding } = await file;

      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
        region: "ap-south-1",
      });

      const params = {
        ACL: "public-read",
        Bucket: process.env.AWS_S3_BUCKET,
        Key: filename,
        Body: createReadStream(),
      };

      const songUrl = new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
            reject(err);
          }
          console.log(`File uploaded succesfully ${data.Location}`);
          resolve(data.Location);
        });
      });

      return {
        url: await songUrl,
      };

      // const songId = uuid.v4();
      // const stream = createReadStream();
      // const pathName = path.join(
      //   __dirname,
      //   // `../../public/songs/${filename + songId}`
      //   `../../public/songs/${filename}`
      // );
      // await stream.pipe(fs.createWriteStream(pathName));

      // const songData = {
      //   title: "title",
      //   description: "description",
      //   artist: "artist",
      //   songDuration: "duration",
      //   album: "albumname",
      //   // songURL: `http://localhost:9090/songs/${filename + songId}`,
      //   songURL: `http://localhost:9090/songs/${filename}`,
      //   playCount: 0,
      //   userId: id,
      // };

      // try {
      //   const song = await Song.create(songData);
      //   await song.save();
      //   if (song) {
      //     return {
      //       // url: `http://localhost:9090/songs/${filename + songId}`,
      //       url: `http://localhost:9090/songs/${filename}`,
      //     };
      //   }
      //   return new Error("Song not uploaded");
      // } catch (err) {
      //   throw new Error(err);
      // }
    },
    // 1. Validate file metadata.

    // 2. Stream file contents into cloud storage:
    // https://nodejs.org/api/stream.html

    // 3. Record the file upload in your DB.
    // const id = await recordFile( … )
  },
};
