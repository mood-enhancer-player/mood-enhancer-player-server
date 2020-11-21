const User = require("../../models/User");
const checkAuth = require("../../common/utils/checkAuth");
const checkAdmin = async (context) => {
  try {
    const { id } = checkAuth(context);
    const user = await User.findById(id);
    console.log("User", user);
    if (user) {
      if (!user.admin) {
        console.log("run");
        throw new Error("You Are Not Authorize To Perform This Operation");
      }
    }
    return new Error("User not found");
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { checkAdmin };
