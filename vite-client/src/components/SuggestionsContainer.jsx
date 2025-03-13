import React, { useMemo } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Grid2, Typography } from "@mui/material";
import _ from "lodash";
import { LoadingBarsIcon } from "./LoadingBars.jsx";
import SuggestionItem from "./SuggestionItem.jsx";
import * as PropTypes from "prop-types";
import useSuggestionApi from "../hooks/useSuggestionApi.js";

export function SuggestionsContainer(props) {
  const [parent] = useAutoAnimate();
  const { suggestionResponses } = useSuggestionApi();
  const nonEmptyResponses = useMemo(
    () => suggestionResponses?.filter((r) => !_.isEmpty(r.response)),
    [suggestionResponses],
  );

  return (
    <Grid2
      container
      direction="column-reverse"
      flexWrap="nowrap"
      sx={{
        minHeight: "calc(98vh - 180px )",
        maxHeight: "calc(98vh - 180px )",
        overflowY: "auto",
      }}
      ref={parent}
      spacing={1.5}
    >
      {(suggestionResponses?.[0]?.prompt !== props.delayedTranscript ||
        _.isEmpty(suggestionResponses?.[0]?.response)) &&
        !_.isEmpty(props.delayedTranscript) && (
          <Grid2 container>
            <Grid2>
              <Typography sx={{ color: "#9f9f9f", fontStyle: "italic" }}>
                {props.delayedTranscript}
              </Typography>
            </Grid2>
            <Grid2>
              <LoadingBarsIcon sx={{ color: "#9f9f9f" }} />
            </Grid2>
          </Grid2>
        )}

      {nonEmptyResponses?.map((response) => (
        <SuggestionItem key={response.id} response={response} />
      ))}
    </Grid2>
  );
}

SuggestionsContainer.propTypes = {
  delayedTranscript: PropTypes.string,
};
