const checkAuth = require("../../common/utils/checkAuth");

const generateToken = require("../../common/utils/jwtGenerator");
const User = require("../../models/User");
const {
  uploadToS3,
  deleteToS3,
} = require("../../common/awsSetup/s3FileUpload");

module.exports = {
  Mutation: {
    async uploadModelInput(_, { base64Image }, context) {
      console.log("upload imge run");
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          const {
            createReadStream,
            filename,
            mimetype,
            encoding,
          } = await base64Image;

          const base64ImageOnS3 = await uploadToS3(
            createReadStream,
            filename.replace(/ /g, "")
          );
          user.profileSrc = await base64ImageOnS3.fileLocationOnS3;
          await user.save();

          return {
            url: base64ImageOnS3.fileLocationOnS3,
          };
        }
        return new Error("User not found");
        // return {
        //   url: "imgUploaded",
        // };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
