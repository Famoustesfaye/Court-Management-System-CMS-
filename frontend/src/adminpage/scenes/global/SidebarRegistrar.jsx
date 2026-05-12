import React, { useState, useEffect, useRef } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GavelIcon from "@mui/icons-material/Gavel";
import { jwtDecode } from "jwt-decode";
import DefaultImage from "./default.jpg";
import SettingsIcon from "@mui/icons-material/Settings";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ReviewsIcon from "@mui/icons-material/Reviews";
import AddBoxIcon from "@mui/icons-material/AddBox";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PostAddIcon from "@mui/icons-material/PostAdd";

// Single sidebar item
const Item = ({ title, to, icon, selected, setSelected, subItems }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openSubMenu, setOpenSubMenu] = useState(false);

  const handleSubMenuClick = () => {
    setOpenSubMenu(!openSubMenu);
  };

  return (
    <>
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
          fontSize: "19px",
        }}
        onClick={subItems ? handleSubMenuClick : () => setSelected(title)}
        icon={icon}
      >
        <Typography sx={{ fontSize: "inherit" }}>{title}</Typography>
        {to && <Link to={to} />}
      </MenuItem>
      {subItems && openSubMenu && (
        <Menu iconShape="circle">
          {subItems.map((subItem, index) => (
            <MenuItem
              key={index}
              active={selected === subItem.title}
              icon={subItem.icon}
              style={{
                color: colors.grey[100],
                border: "3px solid",
                marginLeft: "30px",
                marginRight: "20px",
                borderTop: "transparent",
                borderRight: "transparent",
                padding: "0px",
                marginBottom: ".6rem",
                borderRadius: "8px",
                borderColor: colors.greenAccent[100],
                fontSize: "19px",
              }}
              onClick={() => setSelected(subItem.title)}
            >
              <Typography sx={{ fontSize: "inherit" }}>
                {subItem.title}
              </Typography>
              {subItem.to && <Link to={subItem.to} />}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

const Sidebar = ({ role, name }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [firstName, setFirstName] = useState(name);
  const fileInputRef = useRef(null);

  // Fetch user image from API
  const fetchUserImage = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.userId;

      const response = await fetch(
        `http://localhost:8081/api/getUserImage/${userId}`
      );
      const data = await response.json();
      setImagePath(data.imagePath);
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
  };

  useEffect(() => {
    fetchUserImage();
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.userId;

      formData.append("userId", userId);

      const response = await fetch("http://localhost:8081/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setImagePath(data.filePath);
      fetchUserImage();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Fetch user first/last name
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          const decodedToken = jwtDecode(accessToken);
          const fullName = `${decodedToken.first_name} ${decodedToken.last_name}`;
          setFirstName(fullName);
        } else {
          setFirstName("Default Name");
        }
      } catch (error) {
        console.error(error);
        setFirstName("Error Fetching User Details");
      }
    };
    fetchUserDetails();
  }, []);

  // Sidebar menu items per role
  const sidebarItems = {
    admin: [
      { title: "Dashboard", to: "/admin", icon: <HomeOutlinedIcon /> },
      { title: "Add User", to: "form", icon: <PersonAddAlt1Icon /> },
      { title: "Team", to: "contacts", icon: <PeopleOutlinedIcon /> },
    ],
    proscutor: [
      { title: "Dashboard", to: "/proscuter", icon: <HomeOutlinedIcon /> },
      { title: "View Cases", icon: <ReviewsIcon />, to: "proscutercase" },
      { title: "Initiate Cases", to: "proscutordocument", icon: <ReceiptOutlinedIcon /> },
    ],
    judge: [
      { title: "Dashboard", to: "/judge", icon: <HomeOutlinedIcon /> },
      { title: "View Cases", to: "casejudge", icon: <ReviewsIcon /> },
      { title: "Appointment", to: "appointment", icon: <ReceiptOutlinedIcon /> },
      { title: "Calendar", to: "calendar", icon: <CalendarTodayOutlinedIcon /> },
      {
        title: "Document Analyzer",
        to: "#",
        icon: <AttachFileIcon />,
        subItems: [
          {
            title: "Open Analyzer",
            to: "https://ethio-legal-assistant.lovable.app",
            icon: <AttachFileIcon />,
          },
        ],
      },
    ],
    registrar: [
      { title: "Dashboard", to: "/registrar", icon: <HomeOutlinedIcon /> },
      { title: "Proscutor Files", to: "casethatcomefromproscutor", icon: <AttachFileIcon /> },
      {
        title: "Case Management",
        icon: <GavelIcon />,
        subItems: [
          { title: "Add Case", to: "/registrar/caseform", icon: <AddBoxIcon /> },
          { title: "View Cases", to: "/registrar/addcase", icon: <ReviewsIcon /> },
        ],
      },
      {
        title: "Client Management",
        icon: <GroupAddIcon />,
        subItems: [
          { title: "Add Client", to: "/registrar/addclient", icon: <PersonAddAlt1Icon /> },
          { title: "View Client", to: "/registrar/viewclient", icon: <PersonSearchIcon /> },
          { title: "Add Advocator", to: "/registrar/addadvocator", icon: <PersonAddAlt1Icon /> },
          { title: "View Advocator", to: "/registrar/viewadvocator", icon: <PersonSearchIcon /> },
        ],
      },
      {
        title: "Settings",
        icon: <SettingsIcon />,
        subItems: [{ title: "Case Type", to: "casetype", icon: <PostAddIcon /> }],
      },
    ],
    Invoice_Clerk: [
      { title: "Dashboard", to: "/invoice_clerk", icon: <HomeOutlinedIcon /> },
      { title: "Invoices", to: "invoices", icon: <ReceiptOutlinedIcon /> },
      { title: "Services", to: "services", icon: <ReceiptOutlinedIcon /> },
    ],
    court_manager: [
      { title: "Dashboard", to: "/court_manager", icon: <HomeOutlinedIcon /> },
      { title: "View Cases", to: "/court_manager/casecourtmanager", icon: <ReviewsIcon /> },
    ],
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          color: `${colors.primary[900]}!important`,
          borderRight: "none",
        },
        "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
        "& .pro-inner-item": { padding: "5px 20px 5px 10px !important" },
        "& .pro-inner-item:hover": { color: "#868dfb !important" },
        "& .pro-menu-item.active": { color: "#6870fa !important" },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{ margin: "10px 0 20px 0", color: colors.grey[100] }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <Typography variant="h3" fontWeight={700} color={colors.grey[100]}>
                  {role.toUpperCase()}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="0px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={imagePath ? `http://localhost:8081/${imagePath}` : DefaultImage}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                  onClick={handleImageClick}
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
                  {firstName}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {role === "admin" && "Administrator"}
                  {role === "judge" && "Judge"}
                  {role === "registrar" && "Registrar"}
                  {role === "Invoice_Clerk" && "Invoice Clerk"}
                  {role === "court_manager" && "Court Manager"}
                  {role === "proscutor" && "Proscutor"}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {sidebarItems[role].map((item, index) => (
              <Item
                key={index}
                title={item.title}
                to={item.to}
                icon={item.icon}
                selected={selected}
                setSelected={setSelected}
                subItems={item.subItems}
              />
            ))}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
