import React, { useState } from "react";
import {
  makeStyles,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    // background: "black",
    padding: "20px",
    width: "600px",
    margin: "auto",
  },
  title: {
    color: "#f0db72",
    textAlign: "center",
    margin: "20px",
    fontFamily: "fangsong",
  },
  textField: {
    margin: "10px",
    width: "500px",
  },
}));

const UploadSongData = () => {
  const classes = useStyles();

  const [values, setValues] = useState({
    name: "",
    description: "",
    singer: "",
    album: "",
  });

  const [songFile, setSongFile] = useState({});
  const [coverFile, setcoverFile] = useState({});

  const onChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const history = useHistory();
  const [UploadSongData, { loading }] = useMutation(UploadSongData_MUTATION, {
    update(_, result) {
      if (result) {
        history.push("/");
        console.log(result);
      }
    },
    onError(err) {
      // setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    // variables:{
    //   username:values.username,
    //   email:values.email
    // }
    // OR
  });

  //   const onFormSubmit = (e) => {
  //     e.preventDefault();
  //     //   formValidation();
  //     uploadSong();
  //     console.log("form is submited");
  //   };

  const songFileHandler = (e) => {
    let file = e.target.files[0];
    setSongFile({ file });
    console.log(file);
    if (file) return;
  };

  const coverFileHandler = (e) => {
    let file = e.target.files[0];
    setcoverFile({ file });
    console.log(file);
    if (file) return;
  };

  const onSongDataSubmit = (e) => {
    UploadSongData({
      variables: {
        songFile: songFile.file,
        coverFile: coverFile.file,
        name: values.name,
        description: values.description,
        singer: values.singer,
        album: values.album,
      },
    });
  };

  return (
    <div>
      <h1 className={classes.title}>SIGN UP</h1>
      {/* <Divider variant="middle" style={{ margin: "15px" }} /> */}

      <form className={classes.root} noValidate autoComplete="off">
        {/* {errors.email ? (
            <div>
              <Alert
                variant="outlined"
                severity="error"
                className={classes.textField}
              >
                {errors.email}
              </Alert>
            </div>
          ) : null} */}
        {loading ? (
          <CircularProgress color="secondary" />
        ) : (
          <h1>Hello Data Loaded</h1>
        )}
        <div>
          <input type="file" onChange={songFileHandler} />
          <input type="file" onChange={coverFileHandler} />

          <TextField
            id="outlined-flexible"
            label="Name"
            variant="outlined"
            color="primary"
            type="text"
            name="name"
            onChange={onChange}
            size="small"
            className={classes.textField}
          />
        </div>
        <div>
          <TextField
            id="outlined-flexible"
            label="Description"
            variant="outlined"
            color="primary"
            type="text"
            name="description"
            onChange={onChange}
            size="small"
            className={classes.textField}
          />
        </div>
        <div>
          <TextField
            id="outlined-flexible"
            label="Singer"
            variant="outlined"
            color="primary"
            type="text"
            name="singer"
            onChange={onChange}
            size="small"
            className={classes.textField}
          />
        </div>
        <div>
          <TextField
            id="outlined-flexible"
            label="Album"
            variant="outlined"
            color="primary"
            type="text"
            name="album"
            onChange={onChange}
            size="small"
            className={classes.textField}
          />
        </div>
        <div>
          <Button
            variant="outlined"
            color="primary"
            onClick={onSongDataSubmit}
            className={classes.textField}
          >
            Upload Song
          </Button>
        </div>
      </form>
    </div>
  );
};

// const UploadSongData_MUTATION = gql`
//   mutation uploadSong(
//     $file: Upload!
//     $songInput:{
//         $title:String!
//         $description:String!
//         $artist:String!
//         $album:String!
//     }
//   ) {
//     uploadSong(file:$file,songInput:{
//     title:$title,
//     description:$description,
//     artist:$artist,
//     album:$album,
//   })
//   {
//     url
//   }
//   }
// `;

const UploadSongData_MUTATION = gql`
  mutation uploadSong(
    $songFile: Upload!
    $coverFile: Upload!
    $name: String!
    $description: String!
    $singer: String!
    $album: String!
  ) {
    uploadSong(
      songFile: $songFile
      coverFile: $coverFile
      name: $name
      description: $description
      singer: $singer
      album: $album
    ) {
      url
    }
  }
`;

export default UploadSongData;
