const fs = require("fs");
const AWS = require("aws-sdk");

const { UserInputError } = require("apollo-server");

const checkAuth = require("../../common/utils/checkAuth");

const User = require("../../models/User");
const Song = require("../../models/Song");
const Artist = require("../../models/Artist");
const {
  uploadToS3,
  deleteToS3,
} = require("../../common/awsSetup/s3FileUpload");
const { checkAdmin } = require("../../common/utils/checkAdmin");
const { default: Axios } = require("axios");
const { nanoid } = require("nanoid");

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
            // singer added
            const singerAlreadyExist = user.singers.includes(song.singer);
            if (!singerAlreadyExist) {
              await user.singers.unshift(song.singer);
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
    async getArtistById(_, { artistId }, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          const artist = await Artist.findById(artistId);
          return artist;
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSongsByArtist(_, { artistId }, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          const artist = await Artist.findById(artistId);
          const songs = await Song.find({});
          const perticularArtistSongs = [];
          songs.forEach((song) => {
            if (song.singer.includes(artist.name)) {
              perticularArtistSongs.push(song);
            }
          });
          return perticularArtistSongs;
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPlayList(_, __, context) {
      // Randomly shuffle songs
      const shuffleSongs = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      };

      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          console.log("userface", user.faceSrc);
          const {
            data: { userMoodtype },
          } = await Axios.get(
            `${process.env.MODEL_APT_URL}/detectEmotion?url=${user.faceSrc}`
          );

          // if (!userMoodtype) {
          //   console.log("Mood Type undefinde");
          //   const songs = await Song.find({}).sort({ playCount: -1 }).limit(10);
          //   return songs;
          // }
          if (userMoodtype === "sad") {
            console.log("Mood Type sad");
            const songs = await Song.find({ moodType: "happy" }).limit(10);
            shuffleSongs(songs);
            return songs;
          } else if (userMoodtype === "happy") {
            console.log("Mood Type happy");
            const songs = await Song.find({ moodType: "neutral" }).limit(10);
            shuffleSongs(songs);
            return songs;
          } else if (userMoodtype === "angy") {
            console.log("Mood Type happy");
            const songs = await Song.find({ moodType: "happy" }).limit(10);
            shuffleSongs(songs);
            return songs;
          } else if (userMoodtype === "neutral") {
            console.log("Mood Type happy");
            const songs = await Song.find({ moodType: "neutral" }).limit(10);
            shuffleSongs(songs);
            return songs;
          } else {
            // All songs
            const songs = await Song.find({}).limit(10);
            shuffleSongs(songs);
            return songs;
          }
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    uploadSong: async (
      _,
      { songFile, coverFile, name, description, singer, album },
      // { file },
      context
    ) => {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        await checkAdmin(context);
        if (user) {
          const {
            createReadStream: createReadStreamForSong,
            filename: songFilename,
            mimetype: songMimetype,
            encoding: songEncoding,
          } = await songFile;

          const songFileOnS3 = await uploadToS3(
            createReadStreamForSong,
            `${nanoid(8) + songFilename.replace(/ /g, "")}`
          );
          console.log("songURL", songFileOnS3.fileLocationOnS3);

          const {
            createReadStream: createReadStreamForCover,
            filename: coverFilename,
            mimetype: coverMimetype,
            encoding: coverEncoding,
          } = await coverFile;

          const coverFileOnS3 = await uploadToS3(
            createReadStreamForCover,
            `${nanoid(8) + coverFilename.replace(/ /g, "")}`
          );
          console.log("coverURL", coverFileOnS3.fileLocationOnS3);
          const {
            data: { moodType = "bad" },
          } = await Axios.get(
            `${process.env.MODEL_APT_URL}?url=${songFileOnS3.fileLocationOnS3}`
          );

          console.log(songFileOnS3.fileLocationOnS3);

          const songObject = {
            name,
            description,
            singer,
            album,
            musicSrc: songFileOnS3.fileLocationOnS3,
            cover: coverFileOnS3.fileLocationOnS3,
            playCount: 0,
            moodType,
            userId: id,
          };

          const song = await Song.create(songObject);
          await song.save();
          if (song) {
            return {
              url:
                songFileOnS3.fileLocationOnS3 +
                " " +
                coverFileOnS3.fileLocationOnS3,
            };
          }
          return new Error("Song not uploaded");
        }
        return new Error("User not authorize to upload the song");
      } catch (err) {
        throw new Error(err);
      }

      // const { title, description, artist, album } = songInput;

      // const { id } = checkAuth(context);
      // const {
      //   createReadStream,
      //   songFilename,
      //   songMimetype,
      //   songEncoding,
      // } = await songFile;

      // const songFileOnS3 = await uploadToS3(createReadStream, songFilename);
      // console.log("songURL", songFileOnS3.fileLocationOnS3);

      // const {
      //   createReadStreamForCover,
      //   coverFilename,
      //   coverMimetype,
      //   coverEncoding,
      // } = await coverFile;

      // const coverFileOnS3 = await uploadToS3(
      //   createReadStreamForCover,
      //   coverFilename
      // );
      // console.log("coverURL", coverFileOnS3.fileLocationOnS3);

      // Store Into LocalDiskStorage Of Server
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
      // 1. Validate file metadata.

      // 2. Stream file contents into cloud storage:
      // https://nodejs.org/api/stream.html

      // 3. Record the file upload in your DB.
      // const id = await recordFile( … )
    },

    deleteSong: async (_, { songId }, context) => {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        await checkAdmin(context);
        if (user) {
          const song = await Song.findById(songId);
          if (song) {
            const splitedCoverURL = song.cover.split("/");
            const coverURL = splitedCoverURL[splitedCoverURL.length - 1];

            const splitedMusicSrcURL = song.musicSrc.split("/");
            const musicSrcURL =
              splitedMusicSrcURL[splitedMusicSrcURL.length - 1];
            console.log(coverURL);
            console.log(musicSrcURL);
            await deleteToS3(coverURL);
            await deleteToS3(musicSrcURL);
            await Song.findByIdAndDelete(songId);
          } else {
            throw new Error("Song not Found");
          }
        }
        return "Song Deleted";
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
