import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useSocket } from "./SocketProvider.jsx";
import _ from "lodash";

const SuggestionsContext = createContext(null);

export const SuggestionsProvider = ({ children }) => {
  const { isConnected, emitEvent, listenEvent, removeEventListener } =
    useSocket();
  const [suggestions, setSuggestions] = useState([]);
  const latencyStartTimes = useRef({}); // Store start times by request ID

  const nonEmptySuggestions = useMemo(
    () => suggestions?.filter((r) => !_.isEmpty(r.response)),
    [suggestions],
  );

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
      setSuggestions((prevResponses) => [
        { id, prompt: transcript, response: "", latency: null },
        ...prevResponses,
      ]);
      return { id, prompt: transcript, mock: true };
    }
  };

  const getNewSuggestion = (transcript) => {
    const promptRequestData = prepareTranscriptForPrompt(transcript);
    console.log("SEND PROMPT: ", promptRequestData);
    emitEvent("send_prompt", promptRequestData);
  };

  const handleSuggestionMessage = ({ id, response }) => {
    console.log("RECEIVED MESSAGE: ", response);
    const endTime = Date.now();
    const startTime = latencyStartTimes.current[id] || endTime;
    const latency = ((endTime - startTime) / 1000).toFixed(2);

    setSuggestions((prevResponses) =>
      prevResponses.map((entry) =>
        entry.id === id ? { ...entry, response, latency } : entry,
      ),
    );
  };

  return (
    <SuggestionsContext.Provider
      value={{
        suggestions,
        nonEmptySuggestions,
        latencyStartTimes,
        getNewSuggestion,
      }}
    >
      {children}
    </SuggestionsContext.Provider>
  );
};

export const useSuggestions = () => {
  return useContext(SuggestionsContext);
};
