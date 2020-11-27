const whitelist = [process.env.CLIENT_URL, process.env.ADMIN_URL];
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  console.log(req.header("Origin"));
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
exports.corsWithOptions = corsOptionsDelegate;
