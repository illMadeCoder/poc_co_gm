import React from "react";
import { alpha, Grid2, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CommentIcon from "@mui/icons-material/Comment";
import * as PropTypes from "prop-types";

export default function SuggestionItem(props) {
  return (
    <Grid2
      container
      direction="column-reverse"
      sx={{
        p: 1.5,
        borderRadius: 3,
        backdropFilter: "blur(5px)",
        backgroundColor: alpha("#000000", 0.3),
      }}
    >
      <Grid2 container alignItems="flex-start">
        <Grid2 sx={{ pr: 1 }}>
          <AutoAwesomeIcon color="primary" sx={{ fontSize: 20 }} />
        </Grid2>
        <Grid2 size="grow">
          <Typography color="primary">{props.response.response}</Typography>
        </Grid2>
      </Grid2>
      <Grid2 container alignItems="flex-start">
        <Grid2 sx={{ pr: 1 }}>
          <CommentIcon sx={{ color: "grey.500", fontSize: 20 }} />
        </Grid2>
        <Grid2 size="grow">
          <Typography variant="caption">{props.response.prompt}</Typography>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

SuggestionItem.propTypes = { response: PropTypes.any };
