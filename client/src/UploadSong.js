import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const UPLOAD_FILE = gql`
  mutation uploadSong($file: Upload!) {
    uploadSong(file: $file) {
      url
    }
  }
`;

const UploadSong = () => {
  const [link, setLink] = useState("#");
  const [uploadSong] = useMutation(UPLOAD_FILE, {
    onCompleted: (data) => {
      console.log(data.uploadSong.url);
      setLink(data.uploadSong.url);
      console.log(data);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file) return;
    uploadSong({ variables: { file } });
  };
  console.log(link);
  return (
    <div>
      <h1>Upload File</h1>
      <input type="file" onChange={handleFileChange} />
      {<a href={link}>click here</a>}
    </div>
  );
};

export default UploadSong;
