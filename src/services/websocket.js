let socket = null;
const clientId = crypto.randomUUID();

const getWebSocketBase = () => {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocal) {
    return "ws://127.0.0.1:8000";
  }

  // 🔥 You 
  return "wss://prototype-nmqf.onrender.com";
};

export const connectToRoom = (roomId, onMessage) => {
  if (socket) {
    socket.close();
  }

  const BASE_WS = getWebSocketBase();

  socket = new WebSocket(`${BASE_WS}/ws/editor/${roomId}/`);

  socket.onopen = () => {
    console.log("Connected to room:", roomId);
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };
};

export const sendCodeUpdate = (filename, code) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "code_update",
        payload: { filename, code },
        sender: clientId,
      })
    );
  }
};

export const createFile = (filename) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "file_create",
        payload: { filename },
      })
    );
  } else {
    console.log("Socket not ready");
  }
};

export const openFile = (filename) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "file_open",
        payload: { filename },
      })
    );
  }
};

export const getClientId = () => clientId;