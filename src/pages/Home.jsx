import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [roomInput, setRoomInput] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = crypto.randomUUID().slice(0, 8);
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomInput.trim()) {
      navigate(`/room/${roomInput.trim()}`);
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "20px",
      background: "#1e1e1e",
      color: "white"
    }}>
      <h1>Collaborative Code Editor</h1>

      <button
        onClick={createRoom}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Create New Room
      </button>

      <div>
        <input
          placeholder="Enter Room ID"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          style={{ padding: "8px" }}
        />
        <button
          onClick={joinRoom}
          style={{ padding: "8px 12px", marginLeft: "10px" }}
        >
          Join
        </button>
      </div>
    </div>
  );
}