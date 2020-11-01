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

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
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
  },
};
