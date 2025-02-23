import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useSpeechRecognition from './hooks/useSpeechRecognition';

const socket = io('http://localhost:5000', { withCredentials: true });

function App() {
    const [aiResponse, setAiResponse] = useState('');
    const { transcript, listening, startListening, stopListening } = useSpeechRecognition();

    useEffect(() => {
	socket.on('ai_response', (response) => setAiResponse(response));
	return () => socket.off('ai_response');
    }, []);

    useEffect(() => {
	if (transcript.trim() !== '') {
	    socket.emit('send_prompt', transcript); // Send transcript to backend via WebSocket
	}
    }, [transcript]);

    return (
	<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6">
	    <h1 className="text-3xl font-bold">🤖 AI Assistant Demo (Speech + WebSocket)</h1>
	    <button
		onClick={listening ? stopListening : startListening}
		className={`${
          listening ? 'bg-red-500' : 'bg-green-500'
        } text-white px-6 py-3 rounded text-lg`}
	    >
		{listening ? 'Stop Listening 🛑' : 'Start Listening 🎙️'}
	    </button>
	    <div className="bg-white p-6 rounded shadow w-2/3">
		<h2 className="text-xl font-semibold">📝 Live Transcript:</h2>
		<p className="bg-gray-100 p-4 rounded mt-2">{transcript || '🎤 Say something...'}</p>
	    </div>
	    <div className="bg-green-100 p-6 rounded shadow w-2/3">
		<h2 className="text-xl font-semibold">🤖 AI Suggestion:</h2>
		<p className="p-4 rounded mt-2">{aiResponse || '💡 AI responses will appear here.'}</p>
	    </div>
	</div>
    );
}

export default App;
