import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useSocket from "./useSocket.js";

const useSuggestionApi = ({
  namespace = "",
  options = { withCredentials: true },
} = {}) => {
  const { emitEvent, listenEvent, removeEventListener } = useSocket({
    namespace,
    options,
  });

  const [suggestionResponses, setSuggestionResponses] = useState([]);
  const latencyStartTimes = useRef({}); // Store start times by request ID

  useEffect(() => {
    if (listenEvent) {
      listenEvent("ai_response", handleSuggestionMessage);
    }

    return () => {
      removeEventListener("ai_response");
    };
  }, [listenEvent, removeEventListener]);

  const prepareTranscriptForPrompt = (transcript) => {
    if (transcript.trim() !== "") {
      const id = uuidv4(); // Unique ID for each request
      latencyStartTimes.current[id] = Date.now(); // Start time per request
      setSuggestionResponses((prevResponses) => [
        { id, prompt: transcript, response: "", latency: null },
        ...prevResponses,
      ]);
      return { id, prompt: transcript, mock: true };
    }
  };

  const sendTranscriptForSuggestion = (transcript) => {
    const promptRequestData = prepareTranscriptForPrompt(transcript);
    console.log("SEND PROMPT: ", promptRequestData);
    emitEvent("send_prompt", promptRequestData);
  };

  const handleSuggestionMessage = ({ id, response }) => {
    console.log("RECEIVED MESSAGE: ", response);
    const endTime = Date.now();
    const startTime = latencyStartTimes.current[id] || endTime;
    const latency = ((endTime - startTime) / 1000).toFixed(2);

    setSuggestionResponses((prevResponses) =>
      prevResponses.map((entry) =>
        entry.id === id ? { ...entry, response, latency } : entry,
      ),
    );
  };

  return {
    suggestionResponses,
    latencyStartTimes,
    sendTranscriptForSuggestion,
  };
};

export default useSuggestionApi;
