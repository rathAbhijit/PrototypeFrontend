import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, onChange }) {
  return (
    <Editor
      height="90vh"
      defaultLanguage="python"
      value={code}
      onChange={(value) => onChange(value)}
      theme="vs-dark"
    />
  );
}