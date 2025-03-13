import React from "react";
import { alpha, Button, Grid2, Paper, Typography } from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import * as PropTypes from "prop-types";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function SuggestionControlContainer(props) {
  const [parent] = useAutoAnimate();

  const buttonStyles = {
    transition: "all 0.8s ease",
    // transition: "transform 1s cubic-bezier(0.85, 0, 0.15, 1), border-radius 0.25s cubic-bezier(0.2, 0, 0.15, 1)",
    // transition: "border-radius 1.25s cubic-bezier(0.83, 0, 0.17, 1), width 0.5s, min-width 0.5s",
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
        ref={parent}
      >
        <Grid2
          container
          justifyContent="flex-start"
          // size={12}
          sx={{ pt: 1, pb: 1, px: 1 }}
        >
          <Typography sx={{ color: alpha("#ffffff", 0.45) }}>
            {props.show
              ? "Searching vast distances..."
              : 'To get suggestions, click "Begin Scrying"'}
          </Typography>
        </Grid2>
        {/*{isRecording && <Grid2>*/}
        {/*  <Typography sx={{visibility: "hidden"}}>Something here</Typography>*/}
        {/*</Grid2>}*/}
        <Grid2 sx={{ pr: props.show ? 2 : 0 }}>
          <Button
            variant="contained"
            // color={"error"}
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
              <AutoAwesomeIcon
              // color={props.show ? "primary" : undefined}
              />
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
