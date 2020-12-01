const checkAuth = require("../../common/utils/checkAuth");
const User = require("../../models/User");
const {
  uploadToS3,
  deleteToS3,
} = require("../../common/awsSetup/s3FileUpload");

module.exports = {
  Mutation: {
    async uploadUserMoodImg(_, { userMoodImgFile }, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          const {
            createReadStream,
            filename,
            mimetype,
            encoding,
          } = await userMoodImgFile;

          const userMoodImgFileOnS3 = await uploadToS3(
            createReadStream,
            filename.replace(/ /g, "")
          );
          user.faceSrc = await userMoodImgFileOnS3.fileLocationOnS3;
          await user.save();

          return {
            url: userMoodImgFileOnS3.fileLocationOnS3,
          };
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
