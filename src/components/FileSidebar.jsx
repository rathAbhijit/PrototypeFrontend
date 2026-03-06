import { useState } from "react";
import TreeNode from "./TreeNode";
import { themes } from "../styles/theme";

export default function FileSidebar({
  tree,
  activeNode,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  theme
}) {

  const [creatingRoot, setCreatingRoot] = useState(null);
  const [name, setName] = useState("");

  const t = themes[theme];

  const submitCreate = () => {

    if (!name.trim()) {
      setCreatingRoot(null);
      return;
    }

    onCreate(null, creatingRoot, name.trim());

    setCreatingRoot(null);
    setName("");

  };

  return (

    <div
      style={{
        width:260,
        background: t.colors.sidebar,
        borderRight: `1px solid ${t.colors.border}`,
        display:"flex",
        flexDirection:"column",
        color: t.colors.text,
        fontFamily: t.fonts.ui
      }}
    >

      {/* Top buttons */}

      <div
        style={{
          padding:"10px",
          borderBottom: `1px solid ${t.colors.border}`,
          display:"flex",
          gap:"6px"
        }}
      >

        <button
          style={getBtnStyle(t)}
          onClick={()=>setCreatingRoot("file")}
        >
          📄
        </button>

        <button
          style={getBtnStyle(t)}
          onClick={()=>setCreatingRoot("folder")}
        >
          📁
        </button>

      </div>


      {/* root inline creation */}

      {creatingRoot && (

        <div style={{padding:"8px"}}>

          <input
            autoFocus
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder={`New ${creatingRoot}`}
            style={getInputStyle(t)}
            onKeyDown={(e)=>{

              if(e.key==="Enter") submitCreate();
              if(e.key==="Escape") setCreatingRoot(null);

            }}
            onBlur={submitCreate}
          />

        </div>

      )}



      {/* Tree */}

      <div style={{flex:1,padding:"8px"}}>

        {tree
          .filter(n => !n.parent)
          .map(node => (

            <TreeNode
              key={node.id}
              node={node}
              tree={tree}
              activeNode={activeNode}
              onSelect={onSelect}
              onCreate={onCreate}
              onRename={onRename}
              onDelete={onDelete}
              theme={theme}
            />

          ))
        }

      </div>

    </div>

  );

}



function getBtnStyle(t){

  return {
    background: t.colors.hover,
    border: `1px solid ${t.colors.border}`,
    color: t.colors.text,
    padding:"4px 8px",
    cursor:"pointer",
    borderRadius:"4px",
    fontSize:"13px",
    transition:"all 0.15s ease"
  };

}


function getInputStyle(t){

  return {
    width:"160px",
    background: t.colors.background,
    color: t.colors.text,
    border: `1px solid ${t.colors.border}`,
    padding:"3px 6px",
    fontFamily: t.fonts.ui
  };

}