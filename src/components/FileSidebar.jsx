import { useState } from "react";

export default function FileSidebar({
  files,
  activeFile,
  onSelectFile,
  onCreateFile
}) {
  const [newFileName, setNewFileName] = useState("");

  const handleCreate = () => {
    if (!newFileName.trim()) return;

    onCreateFile(newFileName.trim());
    setNewFileName("");
  };

  return (
    <div style={{
      width: "200px",
      background: "#1e1e1e",
      color: "white",
      padding: "10px",
      borderRight: "1px solid #333"
    }}>
      <h4>Files</h4>

      {files.map((file) => (
        <div
          key={file}
          onClick={() => onSelectFile(file)}
          style={{
            padding: "5px",
            cursor: "pointer",
            background: file === activeFile ? "#333" : "transparent"
          }}
        >
          {file}
        </div>
      ))}

      <div style={{ marginTop: "10px" }}>
        <input
          placeholder="create file"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          style={{ width: "100%", padding: "4px" }}
        />

        <button
          onClick={handleCreate}
          style={{ width: "100%", marginTop: "5px" }}
        >
          Create
        </button>
      </div>
    </div>
  );
}