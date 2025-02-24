// src/components/SpeechToText.jsx
import React from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const SpeechToText = () => {
  const { transcript, listening, startListening, stopListening } = useSpeechRecognition();

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">🎙️ Live Speech Recognition</h2>
      <button
        onClick={listening ? stopListening : startListening}
        className={`px-4 py-2 rounded ${
          listening ? 'bg-red-500' : 'bg-green-500'
        } text-white`}
      >
        {listening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <p className="mt-4 bg-gray-100 p-4 rounded">{transcript}</p>
    </div>
  );
};

export default SpeechToText;
