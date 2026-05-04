import React, { useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import Sidebar from "./scenes/global/SidebarRegistrar";
import Topbar from "./scenes/global/Topbar";
import { Outlet } from "react-router-dom";

export default function Adminss() {
  const theme = useTheme();
  const [isSidebar, setIsSidebar] = useState(true);
  const colors = tokens(theme.palette.mode);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: `${colors.blueAccent[900]}`,
        overflow: "hidden",
      }}
    >
      <Sidebar isSidebar={isSidebar} role="registrar" privateImage="" />
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        <Topbar setIsSidebar={setIsSidebar} />
        <div
          style={{
            overflowY: "auto",
            height: "calc(100vh - 64px)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* 64px is the height of the Topbar */}
          <Outlet />
        </div>
      </div>
      <style>{`
            ::-webkit-scrollbar {
              display: none;
            }
            -ms-overflow-style: none;
            scrollbar-width: none;
          `}</style>
    </div>
  );
}
