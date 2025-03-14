import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socket");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const emitEvent = useCallback(
    (event, data) => {
      if (socketRef.current) {
        socketRef.current.emit(event, data);
      }
    },
    [socketRef.current],
  );

  const listenEvent = useCallback(
    (event, callback) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback);
      }
    },
    [socketRef.current],
  );

  const removeEventListener = useCallback(
    (event) => {
      if (socketRef.current) {
        socketRef.current.off(event);
      }
    },
    [socketRef.current],
  );

  return (
    <SocketContext.Provider
      value={{ isConnected, emitEvent, listenEvent, removeEventListener }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
