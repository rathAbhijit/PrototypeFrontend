import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import FileSidebar from "../components/FileSidebar";

export default function EditorRoom() {

  const { roomId } = useParams();

  const [tree, setTree] = useState([]);
  const [activeNode, setActiveNode] = useState(null);

  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const resizing = useRef(false);

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://prototype-e9pu.onrender.com";


  const loadTree = async () => {

    const res = await fetch(`${API_BASE}/api/rooms/${roomId}/tree/`);
    const data = await res.json();

    if (data.length === 0) {

      await fetch(`${API_BASE}/api/rooms/${roomId}/create-node/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: "main.py",
          type: "file",
          parent: null
        })
      });

      const res2 = await fetch(`${API_BASE}/api/rooms/${roomId}/tree/`);
      const newTree = await res2.json();

      setTree(newTree);
      setActiveNode(newTree[0]);

    } else {

      setTree(data);

      if (!activeNode && data.length > 0) {
        setActiveNode(data[0]);
      }

    }

  };


  useEffect(() => {
    loadTree();
  }, []);


  const createNode = async (parent, type) => {

    const name = prompt(`Enter ${type} name`);

    if (!name) return;

    await fetch(`${API_BASE}/api/rooms/${roomId}/create-node/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        type,
        parent
      })
    });

    loadTree();
  };


  const renameNode = async (nodeId, name) => {

    await fetch(`${API_BASE}/api/rooms/rename/${nodeId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });

    loadTree();

  };


  const deleteNode = async (nodeId) => {

    if (!window.confirm("Delete item?")) return;

    await fetch(`${API_BASE}/api/rooms/delete/${nodeId}/`, {
      method: "DELETE"
    });

    loadTree();

  };


  const selectNode = (node) => {

    if (node.type !== "file") return;

    setActiveNode(node);

  };


  const startResize = () => {
    resizing.current = true;
  };


  const stopResize = () => {
    resizing.current = false;
  };


  const resize = (e) => {

    if (!resizing.current) return;

    setSidebarWidth(Math.max(180, e.clientX));

  };


  useEffect(() => {

    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResize);
    };

  }, []);


  return (

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#181818",
        color: "#eee"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          height: "42px",
          background: "#202020",
          borderBottom: "1px solid #2b2b2b",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: "10px"
        }}
      >

        <button
          onClick={() => setSidebarVisible(!sidebarVisible)}
          style={headerBtn}
        >
          ☰
        </button>

        <span style={{ fontWeight: "bold" }}>
          Collaborative Editor
        </span>

        <span style={{ opacity: 0.6 }}>
          Room: {roomId}
        </span>

      </div>


      {/* WORKSPACE */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden"
        }}
      >

        {/* SIDEBAR */}
        {sidebarVisible && (
          <div
            style={{
              width: sidebarWidth,
              display: "flex"
            }}
          >

            <FileSidebar
              tree={tree}
              onCreate={createNode}
              onRename={renameNode}
              onDelete={deleteNode}
              onSelect={selectNode}
            />

            {/* RESIZER */}
            <div
              onMouseDown={startResize}
              style={{
                width: "4px",
                cursor: "col-resize",
                background: "#222"
              }}
            />

          </div>
        )}


        {/* EDITOR */}
        <div style={{ flex: 1 }}>

          {activeNode && (
            <CodeEditor
              roomId={`${roomId}-${activeNode.id}`}
            />
          )}

        </div>

      </div>

    </div>

  );

}


const headerBtn = {
  background: "#2a2a2a",
  border: "1px solid #333",
  color: "white",
  padding: "4px 8px",
  cursor: "pointer",
  borderRadius: "4px"
};