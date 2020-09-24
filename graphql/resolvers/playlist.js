const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");

const checkAuth = require("../../common/utils/checkAuth");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../common/utils/validators");
const generateToken = require("../../common/utils/jwtGenerator");
const User = require("../../models/User");

module.exports = {
  Query: {
    async getPlaylist(_, __, context) {
      try {
        const { id } = checkAuth(context);
        const user = await User.findById(id);
        console.log(user);
        if (user) {
          return [
            {
              title: "test title",
              album: "test album",
              songDuration: "test songSize",
              descriptions: "test description",
              artist: "test artist",
              songDuration: "test songduration",
            },
            {
              title: "test title 2",
              album: "test album 2",
              songDuration: "test songSize 2",
              descriptions: "test description 2",
              artist: "test artist 2",
              songDuration: "test songduration 2",
            },
          ];
        }
        return new Error("User not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  //   Mutation: {
  //     async login(_, { username, password }) {
  //       const { errors, valid } = validateLoginInput(username, password);
  //       if (!valid) {
  //         throw new UserInputError("Error", { errors });
  //       }
  //       const user = await User.findOne({ username });
  //       if (!user) {
  //         errors.general = "User not found";
  //         throw new UserInputError("User not found", { errors });
  //       }

  //       const match = await bcrypt.compare(password, user.password);
  //       if (!match) {
  //         errors.general = "Wrong credentials";
  //         throw new UserInputError("Wrong credentials", { errors });
  //       }

  //       const token = generateToken(user);
  //       return {
  //         ...user._doc,
  //         id: user._id,
  //         token,
  //       };
  //     },

  //     async register(_, args, contex, info) {
  //       let { username, email, password, confirmPassword } = args.registerInput;

  //       // Validate user data

  //       const { valid, errors } = validateRegisterInput(
  //         username,
  //         email,
  //         password,
  //         confirmPassword
  //       );
  //       if (!valid) {
  //         throw new UserInputError("Error", { errors });
  //       }

  //       // make sure user doent already exists

  //       const userExist = await User.findOne({ username });
  //       if (userExist) {
  //         throw new UserInputError("User is already exist", {
  //           errors: {
  //             username: "User is already exist",
  //           },
  //         });
  //       }

  //       // hash password and createa an auth token
  //       password = await bcrypt.hash(password, 12);

  //       const newUser = new User({
  //         username,
  //         email,
  //         password,
  //         createdAt: new Date().toISOString(),
  //       });

  //       const user = await newUser.save();

  //       const token = generateToken(user);

  //       return {
  //         ...user._doc,
  //         id: user._id,
  //         token,
  //       };
  //     },
  //   },
};
