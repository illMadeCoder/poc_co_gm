import { useState, useEffect, useRef } from 'react';
const useSpeechRecognition = () => {
    const [transcript, setTranscript] = useState('');
    const [listening, setListening] = useState(false);
	  const recognitionRef = useRef(null);

    useEffect(() => {
	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	const recognition = new SpeechRecognition();
	recognitionRef.current = recognition;

	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.lang = 'en-US';

	recognition.onresult = (event) => {
	    const currentTranscript = Array.from(event.results)
		  .map((result) => result[0])
		  .map((result) => result.transcript)
		  .join('');
	    setTranscript(currentTranscript);
	};

	recognition.onerror = (event) => {
		if(event.error === "no-speech"){
			setTimeout(() => recognition.start(), 20)
			console.log("handled no-speech, restarting recognition...")
			return;
		}
		if(event.error === "aborted"){
			return;
		}
	    console.error('Speech recognition error:', event.error);
	};

	recognition.onend = () => {
	    if (listening) {
		recognition.start();
	    }
	};

	return () => {
	    recognition.stop();
	};
    }, []);

    const startListening = () => {
	setTranscript('');
	setListening(true);
	if (recognitionRef.current) {
	    recognitionRef.current.start();
	}
    };

    const stopListening = () => {
	setListening(false);
	if (recognitionRef.current) {
	    recognitionRef.current.onend = null; 
	    recognitionRef.current.stop();
	}
    };
		const clearTranscript = () => {
			setTranscript('');
			recognitionRef.current.abort();
			setTimeout(() => recognitionRef.current.start(), 20);
		}

    return { transcript, listening, startListening, stopListening, clearTranscript };
};

export default useSpeechRecognition;
