import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/') // Adjust port if backend uses a different one
      .then((response) => setMessage(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>AI Assistant Frontend</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
