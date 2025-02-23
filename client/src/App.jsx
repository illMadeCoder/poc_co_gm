import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import SpeechToText from './components/SpeechToText';

const socket = io('http://localhost:5000', { withCredentials: true });

function App() {
    const [message, setMessage] = useState('');
    const [input, setInput] = useState('');

    useEffect(() => {
	socket.on('ai_response', (response) => {
	    setMessage(response);
	});

	return () => {
	    socket.off('ai_response');
	};
    }, []);

    const handleSubmit = () => {
	socket.emit('send_prompt', input);
    };

    return (
	<div style={{ textAlign: 'center' }}>
	    <h1>AI Assistant with WebSocket</h1>
	    <input
		type="text"
		value={input}
		onChange={(e) => setInput(e.target.value)}
		placeholder="Enter your prompt..."
	    />
	    <button onClick={handleSubmit}>Get Real-Time Suggestion</button>
	    <p>{message}</p>
	    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
		<SpeechToText />
	    </div>	
	</div>
    );
}



export default App;
