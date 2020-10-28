module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    // const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    const regEx = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be valid email address";
    }
  }
  if (password === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Password must match";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "Username must not be empty";
  } else {
    // const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    const regEx = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be valid email address";
    }
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors.length < 1),
  };
};
