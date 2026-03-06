import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

import CodeEditor from "../components/CodeEditor";
import FileSidebar from "../components/FileSidebar";
import Header from "../components/Header";
import { themes } from "../styles/theme";

export default function EditorRoom() {

  const { roomId } = useParams();

  const [tree, setTree] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);

  const [provider, setProvider] = useState(null);
  const [ydoc, setYdoc] = useState(null);

  const [users, setUsers] = useState([]);

  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const [theme, setTheme] = useState("dark");

  const resizing = useRef(false);

  const t = themes[theme];

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://prototype-nmqf.onrender.com";


  // ===============================
  // LOAD TREE
  // ===============================

  const loadTree = async () => {

    const res = await fetch(`${API_BASE}/api/rooms/${roomId}/tree/`);
    const data = await res.json();

    if (data.length === 0) {

      await fetch(`${API_BASE}/api/rooms/${roomId}/create-node/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setOpenTabs([newTree[0]]);

    } else {

      setTree(data);

      if (!activeNode && data.length > 0) {
        setActiveNode(data[0]);
        setOpenTabs([data[0]]);
      }

    }

  };

  useEffect(() => {
    loadTree();
  }, []);


  // ===============================
  // YJS CONNECTION
  // ===============================

  useEffect(() => {

    const doc = new Y.Doc();

    const wsProvider = new WebsocketProvider(
      "wss://prototypeserver-upcg.onrender.com",
      roomId,
      doc
    );

    wsProvider.on("status", (event) => {
      console.log("Room connection:", event.status);
    });

    wsProvider.awareness.on("change", () => {
      const states = Array.from(wsProvider.awareness.getStates().values());
      setUsers(states);
    });

    setProvider(wsProvider);
    setYdoc(doc);

    return () => {
      wsProvider.destroy();
      doc.destroy();
    };

  }, [roomId]);


  // ===============================
  // FILE ACTIONS
  // ===============================

  const createNode = async (parent, type, name) => {

    if (!name) return;

    await fetch(`${API_BASE}/api/rooms/${roomId}/create-node/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, parent })
    });

    loadTree();

  };

  const renameNode = async (nodeId, name) => {

    if (!name) return;

    await fetch(`${API_BASE}/api/rooms/rename/${nodeId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
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


  // ===============================
  // TAB MANAGEMENT
  // ===============================

  const selectNode = (node) => {

    if (node.type !== "file") return;

    setActiveNode(node);

    setOpenTabs((tabs) => {

      if (tabs.find((t) => t.id === node.id)) return tabs;

      return [...tabs, node];

    });

  };


  const closeTab = (id) => {

    setOpenTabs((tabs) => {

      const updated = tabs.filter((t) => t.id !== id);

      if (activeNode?.id === id) {
        setActiveNode(updated[0] || null);
      }

      return updated;

    });

  };


  // ===============================
  // SIDEBAR RESIZE
  // ===============================

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


  // ===============================
  // UI
  // ===============================

  return (

    <div style={{
      display:"flex",
      flexDirection:"column",
      height:"100vh",
      background: t.colors.background,
      color: t.colors.text,
      fontFamily: t.fonts.ui
    }}>

      <Header
        roomId={roomId}
        users={users}
        theme={theme}
        toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        toggleSidebar={() => setSidebarVisible(!sidebarVisible)}
      />

      <div style={{ display:"flex", flex:1 }}>

        {sidebarVisible && (
          <div style={{ width:sidebarWidth, display:"flex" }}>

            <FileSidebar
              tree={tree}
              activeNode={activeNode}
              onSelect={selectNode}
              onCreate={createNode}
              onRename={renameNode}
              onDelete={deleteNode}
              theme={theme}
            />

            <div
              onMouseDown={startResize}
              style={{
                width:"4px",
                cursor:"col-resize",
                background: t.colors.border
              }}
            />

          </div>
        )}

        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>

          {/* FILE TABS */}

          <div style={{
            display:"flex",
            background: t.colors.tabs,
            borderBottom:`1px solid ${t.colors.border}`
          }}>

            {openTabs.map(tab => (

              <div
                key={tab.id}
                onClick={() => setActiveNode(tab)}
                style={{
                  padding:"6px 14px",
                  cursor:"pointer",
                  background:
                    activeNode?.id === tab.id
                      ? t.colors.activeTab
                      : "transparent",
                  borderRight:`1px solid ${t.colors.border}`,
                  display:"flex",
                  gap:"8px",
                  alignItems:"center",
                  fontSize:"13px"
                }}
              >

                {tab.name}

                <span
                  onClick={(e)=>{
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  style={{opacity:0.6}}
                >
                  ×
                </span>

              </div>

            ))}

          </div>


          <div style={{ flex:1 }}>

            {provider && ydoc && activeNode && (
              <CodeEditor
                key={activeNode.id}
                provider={provider}
                ydoc={ydoc}
                nodeId={activeNode.id}
                theme={theme}
              />
            )}

          </div>

        </div>

      </div>

    </div>

  );

}