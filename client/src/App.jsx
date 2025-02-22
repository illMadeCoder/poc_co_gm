import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [input, setInput] = useState('');

  const getSuggestion = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/suggest', { prompt: input });
      setMessage(response.data.suggestion);
    } catch (error) {
      console.error('Error fetching suggestion:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>AI Assistant</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt..."
      />
      <button onClick={getSuggestion}>Get Suggestion</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
