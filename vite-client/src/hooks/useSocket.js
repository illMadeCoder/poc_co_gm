import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

const useSocket = ({
  namespace = "",
  options = { withCredentials: true },
} = {}) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

  useEffect(() => {
    console.log({
      uri: `${SOCKET_SERVER_URL}/${namespace}`,
      opts: memoizedOptions,
    });
    socketRef.current = io(
      `${SOCKET_SERVER_URL}/${namespace}`,
      memoizedOptions,
    );

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
  }, [namespace, memoizedOptions]);

  // Define functions inside return so they always use the latest socket state
  return {
    isConnected,
    emitEvent: (event, data) => {
      if (socketRef.current) {
        socketRef.current.emit(event, data);
      } else {
        console.log("no socket when attempting to emit event");
      }
    },
    listenEvent: (event, callback) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback);
      }
    },
    removeEventListener: (event) => {
      if (socketRef.current) {
        socketRef.current.off(event);
      }
    },
  };
};

export default useSocket;
