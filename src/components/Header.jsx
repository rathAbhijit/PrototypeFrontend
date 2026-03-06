import { useState } from "react";
import { themes } from "../styles/theme";

export default function Header({
  roomId,
  users = [],
  saveStatus = "",
  theme,
  toggleTheme,
  toggleSidebar
}) {

  const [copied, setCopied] = useState(false);

  const t = themes[theme];

  const inviteLink = `${window.location.origin}/room/${roomId}`;

  const copyLink = async () => {

    try {

      await navigator.clipboard.writeText(inviteLink);

      setCopied(true);

      setTimeout(() => setCopied(false), 1500);

    } catch (err) {

      console.error("Clipboard failed");

    }

  };

  return (
    <div
      style={{
        height: "44px",
        background: t.colors.header,
        borderBottom: `1px solid ${t.colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        color: t.colors.text,
        fontFamily: t.fonts.ui
      }}
    >

      {/* LEFT */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>

        <button
          style={getBtnStyle(t)}
          onClick={toggleSidebar}
        >
          ☰
        </button>

        <span style={{ fontWeight: "600", letterSpacing: "0.3px" }}>
          Collaborative Editor
        </span>

        <span style={{ opacity: 0.6, fontSize: "13px" }}>
          Room: {roomId}
        </span>

      </div>


      {/* RIGHT */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

        <span style={{ opacity: 0.7 }}>
          👥 {users.length}
        </span>

        <span style={{ fontSize: "12px", opacity: 0.6 }}>
          {saveStatus}
        </span>

        <button
          style={getBtnStyle(t)}
          onClick={toggleTheme}
        >
          {theme === "dark" ? "☀" : "🌙"}
        </button>

        <button
          style={getBtnStyle(t)}
          onClick={copyLink}
        >
          {copied ? "Copied ✓" : "Invite"}
        </button>

      </div>

    </div>
  );
}


function getBtnStyle(t) {

  return {
    background: t.colors.hover,
    border: `1px solid ${t.colors.border}`,
    color: t.colors.text,
    padding: "4px 10px",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "13px",
    transition: "all 0.15s ease"
  };

}