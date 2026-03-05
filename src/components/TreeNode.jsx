import { useState, useEffect } from "react";

export default function TreeNode({
  node,
  level,
  onCreate,
  onRename,
  onDelete,
  onSelect
}) {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(node.name);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const padding = level * 14;

  // auto close menu after 3 seconds
  useEffect(() => {
    if (!menuOpen) return;

    const timer = setTimeout(() => {
      setMenuOpen(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [menuOpen]);

  return (
    <div
      style={{ paddingLeft: padding, position: "relative" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setMenuOpen(false);
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          padding: "2px 4px"
        }}
      >
        <div
          onClick={() =>
            node.type === "folder"
              ? setOpen(!open)
              : onSelect(node)
          }
        >
          {node.type === "folder"
            ? open ? "📂" : "📁"
            : "📄"}

          {editing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                setEditing(false);
                onRename(node.id, name);
              }}
              style={{
                marginLeft: 6,
                background: "#222",
                color: "white",
                border: "1px solid #444"
              }}
            />
          ) : (
            <span style={{ marginLeft: 6 }}>
              {node.name}
            </span>
          )}
        </div>

        {/* 3-dot button appears only on hover */}
        {hover && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "#111",
              border: "none",
              color: "#888",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            ⋯
          </button>
        )}
      </div>

      {menuOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 22,
            background: "#1c1c1c",
            border: "1px solid #333",
            borderRadius: "4px",
            padding: "6px",
            fontSize: "13px",
            zIndex: 10
          }}
        >
          {node.type === "folder" && (
            <>
              <div
                style={menuItem}
                onClick={() => onCreate(node.id, "file")}
              >
                New File
              </div>

              <div
                style={menuItem}
                onClick={() => onCreate(node.id, "folder")}
              >
                New Folder
              </div>
            </>
          )}

          <div
            style={menuItem}
            onClick={() => setEditing(true)}
          >
            Rename
          </div>

          <div
            style={menuItem}
            onClick={() => onDelete(node.id)}
          >
            Delete
          </div>
        </div>
      )}

      {open &&
        node.children?.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            level={level + 1}
            onCreate={onCreate}
            onRename={onRename}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}

const menuItem = {
  padding: "4px 10px",
  cursor: "pointer",
  whiteSpace: "nowrap"
};