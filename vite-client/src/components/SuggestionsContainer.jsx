import React, { useMemo } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Grid2, Typography } from "@mui/material";
import _ from "lodash";
import { LoadingBarsIcon } from "./LoadingBars.jsx";
import SuggestionItem from "./SuggestionItem.jsx";
import * as PropTypes from "prop-types";
import { useSuggestions } from "../providers/SuggestionsProvider.jsx";

export function SuggestionsContainer(props) {
  const [parent] = useAutoAnimate();
  const { suggestions } = useSuggestions();
  const nonEmptySuggestions = useMemo(
    () => suggestions?.filter((r) => !_.isEmpty(r.response)),
    [suggestions],
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
      {(suggestions?.[0]?.prompt !== props.delayedTranscript ||
        _.isEmpty(suggestions?.[0]?.response)) &&
        !_.isEmpty(props.delayedTranscript) && (
          <Grid2 container>
            <Grid2>
              <Typography variant="caption">
                {props.delayedTranscript}
              </Typography>
            </Grid2>
            <Grid2>
              <LoadingBarsIcon sx={{ color: "grey.500" }} />
            </Grid2>
          </Grid2>
        )}

      {nonEmptySuggestions?.map((response) => (
        <SuggestionItem key={response.id} response={response} />
      ))}
    </Grid2>
  );
}

SuggestionsContainer.propTypes = {
  delayedTranscript: PropTypes.string,
};
