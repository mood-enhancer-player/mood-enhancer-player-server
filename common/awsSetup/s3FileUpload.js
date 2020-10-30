const AWS = require("aws-sdk");

const uploadToS3 = async (stream, filename) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    region: "ap-south-1",
  });

  const params = {
    ACL: "public-read",
    Bucket: process.env.AWS_S3_BUCKET,
    Key: filename,
    Body: stream(),
  };

  const fileLocationOnS3 = new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data.Location);
    });
  });

  return {
    fileLocationOnS3: await fileLocationOnS3,
  };
};

module.exports = uploadToS3;
