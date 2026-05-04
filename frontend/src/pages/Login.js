import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import Clock from "../components/clock";
import { CssBaseline, ThemeProvider, useTheme, IconButton, TextField, Button } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import Ap from "../image/court/ff.png";
import Lottie from "react-lottie";
import animationData from "../a.json";
import "../components/navbar.css";
import "./loader.css";
import ChatIcon from "@mui/icons-material/Chat";

// Background animation
const BackgroundAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}>
      <Lottie options={defaultOptions} height={750} width={1800} />
    </div>
  );
};

// Logo
const Logo = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <img src={Ap} alt="Logo" style={{ width: "299px", height: "187px", marginBottom: "5px", borderRadius: "10px" }} />
    <h1 style={{ textAlign: "center" }}>LOGIN</h1>
  </div>
);

// Decode token functions
const getUserRoleFromToken = (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  return decodedToken.role_name;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};
  const colorMode = useContext(ColorModeContext);

  const [loadingButton, setLoadingButton] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Auto-redirect if token exists
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken.status.toLowerCase() === "activated") {
        const role = getUserRoleFromToken(token).toLowerCase();
        navigate(`/${role}`);
      } else {
        navigate("/deactive");
      }
    }
  }, [navigate]);

  // Validate
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 4;

  const handleLogin = async () => {
    try {
      setLoadingButton(true);
      const response = await axios.post("http://localhost:8081/api/login", formData);
      const token = response.data.token;
      localStorage.setItem("accessToken", token);
      const role = getUserRoleFromToken(token).toLowerCase();
      localStorage.setItem("userRole", role);

      toast.success("Login successful");
      window.location.href = window.location.href; // reload to trigger routes
    } catch (error) {
      setLoadingButton(false);
      if (error.response?.status === 401) {
        setErrors({ email: "Invalid email or password" });
      }
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (!validatePassword(formData.password)) newErrors.password = "Password too short";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) handleLogin();
  };

  const styles = {
    container: { display: "flex", justifyContent: "center", alignItems: "center", height: "85%", backgroundColor: colors.primary[600] },
    form: {
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "380px",
      width: "100%",
      boxShadow: "0 0 90px rgba(0, 0, 0, 0.9)",
      backdropFilter: "blur(10px)",
      backgroundColor: `${colors.primary[400]}90`,
    },
  };

  return (
    <>
      <BackgroundAnimation />
      <MainNavbar />
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Clock />
          <div style={styles.container}>
            <form style={styles.form} onSubmit={handleSubmit}>
              <Logo />
              <TextField
                fullWidth
                variant="standard"
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                variant="standard"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={!!errors.password}
                helperText={errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loadingButton}
                style={{ marginTop: "10px", backgroundColor: colors.primary[600] }}
              >
                {loadingButton ? "Loading..." : "Login"}
              </Button>
              <Link to="/forgot-password">Forgot password</Link>
            </form>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>

      {/* Chatbot Button */}
      <IconButton
        onClick={() => setOpenChat(!openChat)}
        style={{ position: "fixed", bottom: 20, right: 20, backgroundColor: "#1976d2", color: "white", zIndex: 1000 }}
      >
        <ChatIcon />
      </IconButton>

      {/* Chatbot iframe */}
      {openChat && (
        <iframe
          src="https://ethio-legal-chatbot.lovable.app"
          title="Chatbot"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: "90vw",
            height: "80vh",
            borderRadius: 10,
            border: "1px solid #1976d2",
            zIndex: 100,
          }}
        ></iframe>
      )}

      <Footer />
    </>
  );
};

export default LoginForm;