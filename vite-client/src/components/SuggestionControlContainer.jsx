import React from "react";
import { Button, Grid2, Paper, Typography } from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import * as PropTypes from "prop-types";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function SuggestionControlContainer(props) {
  const [parent] = useAutoAnimate();

  const buttonStyles = {
    transition: "all 0.8s ease",
    "&:focus": {
      outline: "none",
    },
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 1,
        borderRadius: "24px",
        width: "400px",
        position: "absolute",
        bottom: 20,
        left: "calc(50vw - 200px)",
      }}
    >
      <Grid2
        container
        justifyContent={props.show ? "space-between" : "center"}
        alignItems="center"
        rowSpacing={1}
        ref={parent}
      >
        <Grid2 sx={{ px: 1 }}>
          <Typography sx={{ color: "grey.400" }}>
            {props.show
              ? "Searching vast distances..."
              : 'To get suggestions, click "Begin Scrying"'}
          </Typography>
        </Grid2>
        <Grid2 sx={{ pr: props.show ? 2 : 0 }}>
          <Button
            variant="contained"
            color={props.show ? "inherit" : "primary"}
            onClick={props.listen}
            sx={
              props.show
                ? {
                    color: "#999999",
                    borderRadius: "10px",
                    minWidth: 0,
                    p: 0.5,
                    ...buttonStyles,
                  }
                : { borderRadius: "10px", minWidth: 64, ...buttonStyles }
            }
          >
            {props.show ? (
              <StopIcon sx={{ fontSize: 28 }} color="error" />
            ) : (
              <AutoAwesomeIcon />
            )}
            {!props.show && (
              <Typography sx={{ fontWeight: 600, pl: 1 }}>
                Begin Scrying
              </Typography>
            )}
          </Button>
        </Grid2>
      </Grid2>
    </Paper>
  );
}

SuggestionControlContainer.propTypes = {
  show: PropTypes.bool.isRequired,
  listen: PropTypes.func.isRequired,
};
