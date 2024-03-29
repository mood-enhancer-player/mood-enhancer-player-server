const whitelist = [process.env.CLIENT_URL, process.env.ADMIN_URL];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
exports.corsWithOptions = corsOptionsDelegate;
