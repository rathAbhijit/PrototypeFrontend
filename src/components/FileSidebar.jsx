import TreeNode from "./TreeNode";

export default function FileSidebar({
  tree,
  onCreate,
  onRename,
  onDelete,
  onSelect
}) {

  return (
    <div
      style={{
        width: "260px",
        background: "#111",
        borderRight: "1px solid #222",
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
    >

      {/* Explorer Header */}
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #222",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "13px",
          fontWeight: "bold",
          letterSpacing: "0.5px"
        }}
      >
        <span>EXPLORER</span>

        <div style={{ display: "flex", gap: "6px" }}>

          <button
            onClick={() => onCreate(null, "file")}
            title="New File"
            style={iconBtn}
          >
            📄
          </button>

          <button
            onClick={() => onCreate(null, "folder")}
            title="New Folder"
            style={iconBtn}
          >
            📁
          </button>

        </div>
      </div>

      {/* File Tree */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px"
        }}
      >
        {tree.length === 0 && (
          <div style={{ opacity: 0.5, fontSize: "13px" }}>
            No files yet
          </div>
        )}

        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            onCreate={onCreate}
            onRename={onRename}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

const iconBtn = {
  background: "transparent",
  border: "1px solid #333",
  cursor: "pointer",
  padding: "2px 6px",
  color: "white",
  borderRadius: "4px"
};