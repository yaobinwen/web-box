// 3rd-party
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React from "react";

class URLInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      label: props.label,
      helperText: props.helperText,
      buttonIcon: props.buttonIcon ?? <DownloadIcon />,
      buttonCaption: props.buttonCaption,
    };
  }

  getInputBar = () => {
    return (
      <div>
        <TextField
          label={this.state.label}
          variant="outlined"
          helperText={this.state.helperText}
          type="url"
          onChange={this.props.onURLChange}
          fullWidth
        />
      </div>
    );
  };

  getFetchButton = () => {
    return (
      <Button
        variant="contained"
        size="large"
        endIcon={this.state.buttonIcon}
        onClick={this.props.onButtonClick}
      >
        {this.state.buttonCaption}
      </Button>
    );
  };

  render = () => {
    return (
      <Grid container spacing={2} sx={{ paddingTop: 2.5, paddingBottom: 2.5 }}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          {this.getInputBar()}
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={12}>
          {this.getFetchButton()}
        </Grid>
      </Grid>
    );
  };
}

export default URLInput;
