export default function FileSidebar({
  files,
  activeFile,
  onSelectFile,
  onCreateFile,
}) {
  const handleCreate = () => {
    const name = prompt("Enter file name:");
    if (name) {
      onCreateFile(name);
    }
  };

  return (
    <div
      style={{
        width: "240px",
        background: "#1e1e1e",
        color: "#ccc",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #2a2a2a",
      }}
    >
      <div
        style={{
          padding: "12px",
          fontWeight: "bold",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        Explorer
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {files.map((file) => (
          <div
            key={file}
            onClick={() => onSelectFile(file)}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              background:
                file === activeFile ? "#2d2d2d" : "transparent",
              borderLeft:
                file === activeFile
                  ? "3px solid #4CAF50"
                  : "3px solid transparent",
            }}
          >
            📄 {file}
          </div>
        ))}
      </div>

      <button
        onClick={handleCreate}
        style={{
          padding: "10px",
          background: "#2a2a2a",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        + New File
      </button>
    </div>
  );
}