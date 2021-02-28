const AWS = require("aws-sdk");

const uploadToS3 = async (stream, filename) => {
  console.log(filename);
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

  // const fileLocationOnS3 = new Promise((resolve, reject) => {
  //   s3.upload(params, (err, data) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(data.Location);
  //   });
  // });
  try {
    const fileLocationOnS3 = await s3.upload(params).promise();
    return {
      fileLocationOnS3: fileLocationOnS3.Location,
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};


const deleteToS3 = async (filename) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    region: "ap-south-1",
  });

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: filename,
  };

  const fileLocationOnS3 = new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
      console.log(data);
    });
  });
};

module.exports = { uploadToS3, deleteToS3 };
