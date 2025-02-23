import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs

const socket = io('http://localhost:5000', { withCredentials: true });

function App() {
    const [responses, setResponses] = useState([]);
    const { transcript, listening, startListening, stopListening } = useSpeechRecognition();
    const responseBoxRef = useRef(null);
    const latencyStartTimes = useRef({}); // Store start times by request ID

    useEffect(() => {
	socket.on('ai_response', ({ id, response }) => {
	    const endTime = Date.now();
	    const startTime = latencyStartTimes.current[id] || endTime;
	    const latency = ((endTime - startTime) / 1000).toFixed(2);

	    setResponses((prevResponses) =>
		prevResponses.map((entry) =>
		    entry.id === id ? { ...entry, response, latency } : entry
		)
	    );

	    delete latencyStartTimes.current[id];
	});

	return () => socket.off('ai_response');
    }, []);

    useEffect(() => {
	if (transcript.trim() !== '') {
	    const id = uuidv4(); // Unique ID for each request
	    latencyStartTimes.current[id] = Date.now(); // Start time per request

	    setResponses((prevResponses) => [
		...prevResponses,
		{ id, prompt: transcript, response: '', latency: null },
	    ]);

	    socket.emit('send_prompt', { id, prompt: transcript });
	}
    }, [transcript]);

    useEffect(() => {
	// Auto-scroll when new responses arrive
	if (responseBoxRef.current) {
	    responseBoxRef.current.scrollTop = responseBoxRef.current.scrollHeight;
	}
    }, [responses]);

    return (
	<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6">
	    <h1 className="text-3xl font-bold">D&D AI Assistant Demo</h1>
	    <h2>(Browser Speech + WebSocket + OpenAI)</h2>
	    <button
		onClick={listening ? stopListening : startListening}
		className={`${
          listening ? 'bg-red-500' : 'bg-green-500'
        } text-white px-6 py-3 rounded text-lg`}
	    >
		{listening ? 'Stop Listening 🛑' : 'Start Listening 🎙️'}
	    </button>

	    <div className="bg-white p-6 rounded shadow w-2/3">
		<h2 className="text-xl font-semibold">Live Transcript:</h2>
		<p className="bg-gray-100 p-4 rounded mt-2">{transcript || '🎤 Say something...'}</p>
	    </div>

	    {/* 🎯 FINAL SCROLLBOX FIX - Height limited + scrollable */}
	    <div
		ref={responseBoxRef}
		className="bg-green-100 p-6 rounded shadow w-2/3 border border-gray-300"
		style={{
		    height: '400px', // Fixed height for the scrollbox
		    overflowY: 'auto', // Enables vertical scrolling
		}}
	    >
		<h2 className="text-xl font-semibold mb-4">AI Responses (Newest at Bottom):</h2>
		<div className="flex flex-col gap-4">
		    {responses.length === 0 ? (
			<p className="text-gray-500 text-center">AI responses will appear here.</p>
		    ) : (
			responses.map((entry) => (
			    <div key={entry.id} className="bg-white p-4 rounded shadow mb-2">
				<p>
				    <strong>📝 Prompt:</strong> {entry.prompt || 'N/A'}
				</p>
				<p>
				    <strong>🤖 Response:</strong>{' '}
				    {entry.response || (
					<span className="text-gray-400">Processing...</span>
				    )}
				</p>
				<p className="text-sm text-gray-500">
				    ⏱️ <strong>Latency:</strong>{' '}
				    {entry.latency !== null
				     ? `${entry.latency} seconds`
				     : 'Calculating...'}
				</p>
			    </div>
			))
		    )}
		</div>
	    </div>
	</div>
    );
}

export default App;
