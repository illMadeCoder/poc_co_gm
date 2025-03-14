import React, { useCallback, useEffect, useState } from "react";
import { Container, Grid2, Typography } from "@mui/material";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";
import _ from "lodash";
import SuggestionControlContainer from "../components/SuggestionControlContainer.jsx";
import { SuggestionsContainer } from "../components/SuggestionsContainer.jsx";
import { useSuggestions } from "../providers/SuggestionsProvider.jsx";

function SuggestionsPage() {
  const { nonEmptySuggestions, getNewSuggestion } = useSuggestions();
  const [isRecording, setIsRecording] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [delayedTranscript, setDelayedTranscript] = useState("");

  const {
    transcript,
    listening,
    startListening,
    stopListening,
    clearTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    setTimeout(() => {
      setShowContent(isRecording);
    }, 450);
  }, [isRecording]);

  useEffect(() => {
    if (isRecording !== listening) {
      setIsRecording(listening);
    }
  }, [listening]);

  useEffect(() => {
    if (nonEmptySuggestions?.[0]?.prompt === transcript) {
      clearTranscript();
      setDelayedTranscript("");
    }
  }, [nonEmptySuggestions]);

  const debouncedSendTranscript = useCallback(
    _.debounce((transcript) => getNewSuggestion(transcript), 2000, {
      trailing: true,
    }),
    [],
  );

  useEffect(() => {
    if (!_.isEmpty(transcript)) {
      setDelayedTranscript(transcript);
      debouncedSendTranscript(transcript);
    }
  }, [transcript]);

  // useEffect(() => {
  //   // Auto-scroll when new responses arrive
  //   // if (responseBoxRef.current) {
  //   //   responseBoxRef.current.scrollTop = responseBoxRef.current.scrollHeight;
  //   // }
  //   // console.log({ current_responses: responses });
  // }, [responses]);

  const handleListen = () => {
    const newRecordingValue = !isRecording;
    if (!newRecordingValue) {
      stopListening();
      setIsRecording(newRecordingValue);
    } else {
      startListening();
      setIsRecording(newRecordingValue);
    }
  };

  return (
    <Container maxWidth="md">
      <Grid2 container direction="column" sx={{ minHeight: "98vh" }}>
        <Grid2 size={12} sx={{ pt: 2, pb: 1 }}>
          <Typography variant="h4" align="center">
            Scrying.AI
          </Typography>
        </Grid2>
        <SuggestionsContainer delayedTranscript={delayedTranscript} />
        <SuggestionControlContainer listen={handleListen} show={showContent} />
      </Grid2>
    </Container>
  );
}

export default SuggestionsPage;
