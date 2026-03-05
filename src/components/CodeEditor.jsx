import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

export default function CodeEditor({ roomId }) {
  const editorRef = useRef(null);
  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);
  const saveIntervalRef = useRef(null);

  const [ready, setReady] = useState(false);

  // roomId format = roomId-nodeId
  const parts = roomId.split("-");
  const room = parts[0];
  const nodeId = parts[1];

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://prototype-e9pu.onrender.com";

  useEffect(() => {
    if (!ready || !editorRef.current) return;

    // cleanup previous session
    if (bindingRef.current) bindingRef.current.destroy();
    if (providerRef.current) providerRef.current.destroy();
    if (ydocRef.current) ydocRef.current.destroy();
    if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      roomId,
      ydoc
    );

    providerRef.current = provider;

    provider.on("status", (event) => {
      console.log("Yjs status:", event.status);
    });

    const yText = ydoc.getText("monaco");
    const model = editorRef.current.getModel();

    const binding = new MonacoBinding(
      yText,
      model,
      new Set([editorRef.current]),
      provider.awareness
    );

    bindingRef.current = binding;

    // load initial content
    fetch(`${API_BASE}/api/rooms/content/${nodeId}/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.content && yText.toString().length === 0) {
          yText.insert(0, data.content);
        }
      });

    // autosave every 2s
    saveIntervalRef.current = setInterval(() => {
      const content = yText.toString();

      fetch(`${API_BASE}/api/rooms/save/${nodeId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content
        })
      });
    }, 2000);

    return () => {
      clearInterval(saveIntervalRef.current);

      const finalContent = yText.toString();

      fetch(`${API_BASE}/api/rooms/save/${nodeId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: finalContent
        })
      });

      binding.destroy();
      provider.destroy();
      ydoc.destroy();
    };

  }, [roomId, ready]);

  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      theme="vs-dark"
      defaultValue=""
      onMount={(editor) => {
        editorRef.current = editor;
        setReady(true);
      }}
    />
  );
}