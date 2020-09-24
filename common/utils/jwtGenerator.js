const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");

module.exports = generateToken = (user) => {
  const { id } = user;
  return jwt.sign(
    {
      id,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};
