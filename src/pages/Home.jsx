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
        background: "linear-gradient(135deg,#111 0%,#1e1e1e 100%)",
        color: "#eee",
        fontFamily: "Inter, system-ui, sans-serif"
      }}
    >

      {/* LEFT SIDE */}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px"
        }}
      >

        <h1
          style={{
            fontSize: "48px",
            marginBottom: "20px",
            fontWeight: "600"
          }}
        >
          Real-Time Collaborative Editor
        </h1>

        <p
          style={{
            fontSize: "18px",
            opacity: 0.75,
            maxWidth: "520px",
            lineHeight: "1.6"
          }}
        >
          A lightweight collaborative coding environment built for live
          programming sessions. Create shared rooms instantly, edit files
          together in real time, and watch changes synchronize across all
          connected users.
        </p>

      </div>


      {/* RIGHT SIDE */}

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >

        <div
          style={{
            width: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "22px"
          }}
        >

          {/* CREATE ROOM */}

          <button
            onClick={createRoom}
            style={{
              padding: "14px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: "#4CAF50",
              color: "white",
              fontWeight: "500",
              boxShadow: "0 6px 16px rgba(0,0,0,0.35)"
            }}
          >
            Create New Room
          </button>


          {/* JOIN ROOM */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >

            <input
              placeholder="Enter Room ID"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #444",
                background: "#222",
                color: "white",
                fontSize: "14px"
              }}
            />

            <button
              onClick={joinRoom}
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #444",
                background: "#333",
                color: "white",
                cursor: "pointer"
              }}
            >
              Join Room
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}