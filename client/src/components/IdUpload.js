import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    borderStyle: "dashed",
    borderWidth: "0.15rem",
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    width: "100%",
    minHeight: "5em",
  },
  imagePreview: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    width: "100%",
  },
  image: {
    width: "100%",
  },
}));

const IdUpload = ({ idCard, setIdCard }) => {
  const classes = useStyles();
  const [uploadedFileUrl, setUploadedFileUrl] = useState(idCard || "");

  const onDrop = (acceptedFiles) => {
    handleImageUpload(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleImageUpload = (file) => {
    setUploadedFileUrl(file);
    setIdCard(file);
  };

  const ImagePreview = () => (
    <Paper className={classes.imagePreview} square>
      <Grid container justify="center">
        <Grid item xs={12}>
          <img
            src={URL.createObjectURL(uploadedFileUrl)}
            alt="employment id card"
            className={classes.image}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const dndText =
    uploadedFileUrl === ""
      ? "Drag 'n' drop some files here, or click to upload a photo of your id card"
      : "You can drop or upload another photo to replace the current one";

  return (
    <>
      <div {...getRootProps()} className={classes.root}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant="body1" component="p">
            Drop the files here ...
          </Typography>
        ) : (
          <Typography variant="body1" component="p">
            {dndText}
          </Typography>
        )}
      </div>
      {uploadedFileUrl === "" ? null : <ImagePreview />}
    </>
  );
};

export default IdUpload;
