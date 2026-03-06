import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";
import { themes } from "../styles/theme";

export default function CodeEditor({ provider, ydoc, nodeId, theme }) {

  const bindingRef = useRef(null);
  const modelRef = useRef(null);
  const editorRef = useRef(null);

  const t = themes[theme];

  const handleMount = (editor, monaco) => {

    editorRef.current = editor;

    const awareness = provider.awareness;
    const yText = ydoc.getText(`file-${nodeId}`);

    const model = monaco.editor.createModel("", "python");
    modelRef.current = model;

    editor.setModel(model);

    const editors = new Set();
    editors.add(editor);

    const binding = new MonacoBinding(
      yText,
      model,
      editors,
      awareness
    );

    bindingRef.current = binding;

  };


  useEffect(() => {

    return () => {

      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }

      if (modelRef.current) {
        modelRef.current.dispose();
        modelRef.current = null;
      }

    };

  }, [nodeId]);


  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      theme={theme === "dark" ? "vs-dark" : "vs"}
      onMount={handleMount}

      options={{

        fontSize: 14,
        fontFamily: t.fonts.editor,

        minimap: { enabled: false },

        automaticLayout: true,
        scrollBeyondLastLine: false,

        padding: {
          top: 10,
          bottom: 10
        },

        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: true,

        renderWhitespace: "none",
        renderLineHighlight: "line",

        tabSize: 2

      }}
    />
  );
}