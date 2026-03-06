import { useState, useRef } from "react";
import { themes } from "../styles/theme";

export default function TreeNode({
  node,
  activeNode,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  theme
}) {

  const [expanded,setExpanded] = useState(true);
  const [creating,setCreating] = useState(null);
  const [name,setName] = useState("");

  const [menu,setMenu] = useState(false);
  const timer = useRef(null);

  const t = themes[theme];

  const submitCreate = () => {

    if(!name.trim()){
      setCreating(null);
      return;
    }

    onCreate(node.id,creating,name.trim());

    setCreating(null);
    setName("");

  };


  const toggleMenu = () => {

    setMenu(prev => !prev);

    clearTimeout(timer.current);

    timer.current = setTimeout(()=>{
      setMenu(false);
    },5000);

  };


  return (

    <div style={{position:"relative"}}>

      {/* NODE ROW */}

      <div
        onMouseEnter={(e)=>{
          if(activeNode?.id !== node.id)
            e.currentTarget.style.background = t.colors.hover;
        }}

        onMouseLeave={(e)=>{
          if(activeNode?.id !== node.id)
            e.currentTarget.style.background = "transparent";
        }}

        style={{
          padding:"6px",
          cursor:"pointer",
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          color: t.colors.text,
          background:
            activeNode?.id === node.id
              ? t.colors.activeTab
              : "transparent",
          fontFamily: t.fonts.ui,
          fontSize:"13px"
        }}
      >

        <span style={{display:"flex",alignItems:"center",gap:"6px"}}>

          <span onClick={()=>onSelect(node)}>
            {node.type==="folder"?"📁":"📄"} {node.name}
          </span>


          {node.type === "folder" && (

            <span
              onClick={(e)=>{
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              style={{width:"14px"}}
            >
              {node.children?.length
                ? (expanded ? "▼":"▶")
                : ""
              }
            </span>

          )}

        </span>



        {/* MENU BUTTON */}

        <span
          onClick={(e)=>{
            e.stopPropagation();
            toggleMenu();
          }}
          style={{opacity:0.6}}
        >
          ⋮
        </span>

      </div>



      {/* CONTEXT MENU */}

      {menu && (

        <div
          style={{
            position:"absolute",
            right:"6px",
            top:"28px",
            background: t.colors.sidebar,
            border: `1px solid ${t.colors.border}`,
            borderRadius:"4px",
            padding:"6px",
            display:"flex",
            flexDirection:"column",
            gap:"4px",
            zIndex:100,
            fontFamily: t.fonts.ui
          }}
        >

          {node.type==="folder" && (
            <>
              <div style={menuItem(t)} onClick={()=>setCreating("file")}>
                + file
              </div>

              <div style={menuItem(t)} onClick={()=>setCreating("folder")}>
                + folder
              </div>
            </>
          )}

          <div
            style={menuItem(t)}
            onClick={()=>onRename(node.id,prompt("Rename:",node.name))}
          >
            rename
          </div>

          <div
            style={{...menuItem(t),color:"#ff6666"}}
            onClick={()=>onDelete(node.id)}
          >
            delete
          </div>

        </div>

      )}



      {/* INLINE CREATION */}

      {creating && (

        <div style={{paddingLeft:"20px"}}>

          <input
            autoFocus
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder={`New ${creating}`}
            style={inputStyle(t)}
            onKeyDown={(e)=>{

              if(e.key==="Enter") submitCreate();
              if(e.key==="Escape") setCreating(null);

            }}
            onBlur={submitCreate}
          />

        </div>

      )}



      {/* CHILDREN */}

      {node.type==="folder" && expanded && node.children && (

        <div style={{paddingLeft:"16px"}}>

          {node.children.map(child => (

            <TreeNode
              key={child.id}
              node={child}
              activeNode={activeNode}
              onSelect={onSelect}
              onCreate={onCreate}
              onRename={onRename}
              onDelete={onDelete}
              theme={theme}
            />

          ))}

        </div>

      )}

    </div>

  );

}



function menuItem(t){

  return {
    cursor:"pointer",
    padding:"4px 8px",
    color: t.colors.text,
    fontSize:"13px"
  };

}


function inputStyle(t){

  return {
    width:"160px",
    background: t.colors.background,
    color: t.colors.text,
    border: `1px solid ${t.colors.border}`,
    padding:"3px 6px",
    fontFamily: t.fonts.ui
  };

}