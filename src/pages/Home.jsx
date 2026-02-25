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
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #111 0%, #1e1e1e 100%)",
        color: "#eee",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "20px",
        textAlign: "center"
      }}
    >
      {/* Title */}
      <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
        Real-Time Collaborative Editor
      </h1>

      <p style={{ opacity: 0.7, marginBottom: "40px", maxWidth: "500px" }}>
        Create a shared coding room instantly and collaborate live with
        multiple users. Files persist, changes sync in real time.
      </p>

      {/* Create Button */}
      <button
        onClick={createRoom}
        style={{
          padding: "12px 28px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          background: "#4CAF50",
          color: "white",
          marginBottom: "25px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          transition: "0.2s ease"
        }}
      >
         Create New Room
      </button>

      {/* Join Section */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px"
        }}
      >
        <input
          placeholder="Enter Room ID"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "white",
            width: "180px"
          }}
        />

        <button
          onClick={joinRoom}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#333",
            color: "white",
            cursor: "pointer"
          }}
        >
          Join
        </button>
      </div>
    </div>
  );
}