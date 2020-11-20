const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");
const { nanoid } = require("nanoid");

const checkAuth = require("../../common/utils/checkAuth");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../common/utils/validators");
const generateToken = require("../../common/utils/jwtGenerator");
const User = require("../../models/User");
const {
  uploadToS3,
  deleteToS3,
} = require("../../common/awsSetup/s3FileUpload");
const { mailSender } = require("../../common/mailSetup/nodemailer");

module.exports = {
  Query: {
    async me(_, __, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          return user;
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
    async getAllUsers(_, __, context) {
      try {
        const { id } = checkAuth(context);
        const users = await User.find({});
        if (users) {
          return users;
        }
        return new Error("Users not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(_, { email, password }) {
      const { errors, valid } = validateLoginInput(email, password);
      if (!valid) {
        throw new UserInputError("Error", { errors });
      }
      const user = await User.findOne({ email });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }
      if (user.status === "active") {
        const token = generateToken(user);
        return {
          ...user._doc,
          id: user._id,
          token,
        };
      } else {
        throw new Error("You are Blocked");
      }
    },

    async register(_, args, contex, info) {
      let { username, email, password, confirmPassword } = args.registerInput;

      // Validate user data

      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Error", { errors });
      }

      // make sure user doent already exists

      const userExist = await User.findOne({ email });
      if (userExist) {
        throw new UserInputError("Email is already taken", {
          errors: {
            email: "Email is already taken",
          },
        });
      }

      // hash password and createa an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      const user = await newUser.save();

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async activeOrBlock(_, args, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          user.status === "active"
            ? (user.status = "block")
            : (user.status = "active");
          await user.save();
          return user.status;
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
    async uploadProfile(_, { profileImgFile }, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          const {
            createReadStream,
            filename,
            mimetype,
            encoding,
          } = await profileImgFile;

          const profileImgFileOnS3 = await uploadToS3(
            createReadStream,
            filename.replace(/ /g, "")
          );
          user.profileSrc = await profileImgFileOnS3.fileLocationOnS3;
          await user.save();

          return {
            url: profileImgFileOnS3.fileLocationOnS3,
          };
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
    async updateUserInfo(_, args, context) {
      const { username, email } = args.updateUserInput;
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        if (user) {
          const userNameExist = await User.find({ username });
          if (userNameExist.length) {
            throw new UserInputError(
              "Username Already exist ! please choose another username"
            );
          }
          const emailExist = await User.find({ email });
          if (emailExist.length) {
            throw new UserInputError(
              "Email Already exist ! please choose another username"
            );
          }

          // Username and email is uniqe so update it
          user.username = username;
          user.email = email;
          await user.save();
          return "Your Information updated succesfully";
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
    async resetPassword(_, { email }, context) {
      try {
        // const { id } = checkAuth(context);
        // const user = await User.findById(id);
        const user = await User.findOne({ email });
        if (user) {
          if (!user) {
            throw new UserInputError("Account not found !!");
          } else {
            // Generate 8 digit password
            const randomPassword = nanoid(8);
            // Send password mail
            await mailSender(email, randomPassword);
            const userNewPassword = await bcrypt.hash(randomPassword, 12);
            // update user password
            user.password = userNewPassword;
            await user.save();
            return "New password is send to your mail id";
          }
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
