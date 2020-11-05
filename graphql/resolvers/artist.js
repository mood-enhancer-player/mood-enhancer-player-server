const checkAuth = require("../../common/utils/checkAuth");
const Artist = require("../../models/Artist");
const User = require("../../models/User");
const uploadToS3 = require("../../common/awsSetup/s3FileUpload");

module.exports = {
  Query: {
    async getArtists(_, __, context) {
      try {
        const perticularUserArtist = [];
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          const allArtists = await Artist.find({});
          allArtists.forEach(({ _id, name, singerProfileFile }) => {
            if (user.singers.includes(name)) {
              perticularUserArtist.push({ _id, name, singerProfileFile });
            }
          });
          return perticularUserArtist;
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async addArtist(_, { name, singerProfileFile }, context) {
      console.log(name, singerProfileFile);
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          // convert into capitalize form
          name = name.trim().replace(/\b\w/g, (c) => c.toUpperCase());
          const {
            createReadStream,
            filename,
            mimetype,
            encoding,
          } = await singerProfileFile;
          const singerProfileFileOnS3 = await uploadToS3(
            createReadStream,
            filename
          );

          const artist = await Artist.create({
            name,
            singerProfileFile: singerProfileFileOnS3.fileLocationOnS3,
          });
          await artist.save();
          if (artist) {
            return {
              url: `Artist added successfully ${name} ${singerProfileFileOnS3.fileLocationOnS3}`,
            };
          }
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
