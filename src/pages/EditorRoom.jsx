import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import CodeEditor from "../components/CodeEditor";
import FileSidebar from "../components/FileSidebar";
import {
  connectToRoom,
  sendCodeUpdate,
  createFile,
  openFile,
  getClientId
} from "../services/websocket";

export default function EditorRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [code, setCode] = useState("");
  const [users, setUsers] = useState(1);
  const [copied, setCopied] = useState(false);

  const myId = getClientId();
  const activeFileRef = useRef(null);

  const debouncedSend = useRef(
    debounce((filename, value) => {
      sendCodeUpdate(filename, value);
    }, 150)
  ).current;

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }

    connectToRoom(roomId, (data) => {

      if (data.type === "file_list_update") {
        setFiles(data.files);

        if (!activeFileRef.current && data.files.length > 0) {
          const firstFile = data.files[0];
          setActiveFile(firstFile);
          activeFileRef.current = firstFile;
          openFile(firstFile);
        }
      }

      if (data.type === "code_update") {
        if (data.sender === myId) return;

        const filename = data.payload.filename;

        if (filename === activeFileRef.current) {
          setCode(data.payload.code);
        }
      }

      if (data.type === "presence_update") {
        setUsers(data.count);
      }
    });

    return () => {
      debouncedSend.cancel();
    };
  }, [roomId]);

  const handleChange = (newCode) => {
    setCode(newCode);

    if (activeFileRef.current) {
      debouncedSend(activeFileRef.current, newCode);
    }
  };

  const handleFileSelect = (file) => {
    setActiveFile(file);
    activeFileRef.current = file;
    openFile(file);
  };

  const handleFileCreate = (filename) => {
    createFile(filename);
    setActiveFile(filename);
    activeFileRef.current = filename;
    openFile(filename);
  };

  const handleCopyLink = async () => {
    const link = window.location.href;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#181818",
        color: "#eee",
        fontFamily: "Inter, system-ui, sans-serif"
      }}
    >
      <FileSidebar
        files={files}
        activeFile={activeFile}
        onSelectFile={handleFileSelect}
        onCreateFile={handleFileCreate}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* HEADER */}
        <div
          style={{
            padding: "14px 20px",
            background: "#111",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #2a2a2a",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)"
          }}
        >
          <div style={{ fontSize: "14px", opacity: 0.9 }}>
            <strong>Room:</strong> {roomId}
            <span style={{ marginLeft: "20px" }}>
              👥 {users} active
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            style={{
              padding: "6px 14px",
              cursor: "pointer",
              background: copied ? "#4CAF50" : "#222",
              color: "white",
              border: "1px solid #444",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              fontSize: "13px"
            }}
          >
            {copied ? "✓ Copied" : "Copy Link"}
          </button>
        </div>

        {/* EDITOR AREA */}
        <div style={{ flex: 1 }}>
          <CodeEditor
            code={code}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}