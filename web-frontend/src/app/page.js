
"use client";
import { useEffect, useState } from "react";
import BackendStatusPanel from "./BackendStatusPanel";
import MLEngineStatusPanel from "./MLEngineStatusPanel";
import WeatherPanel from "./WeatherPanel";
import AlertsPanel from "./AlertsPanel";
import ForecastSection from "./ForecastSection";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState("Loading...");
  const [mlStatus, setMlStatus] = useState("Loading...");
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/status")
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.status || "Error"))
      .catch(() => setBackendStatus("Error"));

    fetch("http://localhost:8000/api/ml-status")
      .then((res) => res.json())
      .then((data) => setMlStatus(data.status || "Error"))
      .catch(() => setMlStatus("Error"));

    // Demo: Simulate weather, alerts, and forecast
    setTimeout(() => {
      setWeather({
        location: "North Atlantic",
        temperature: "18°C",
        wind: "15 knots",
        wave: "2.5m",
        forecast: "Clear",
      });
      setAlerts([
        { type: "Cyclone Warning", message: "Cyclone expected in 48 hours." },
        { type: "High Swell", message: "Swells up to 3m expected tomorrow." },
      ]);
      setForecast([
        { day: "Thu", temp: "18°C", wind: "12 knots", wave: "2m", summary: "Clear" },
        { day: "Fri", temp: "19°C", wind: "14 knots", wave: "2.2m", summary: "Partly Cloudy" },
        { day: "Sat", temp: "17°C", wind: "16 knots", wave: "2.8m", summary: "Rain" },
      ]);
    }, 1000);
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#90caf9" : "#1976d2" },
      background: darkMode
        ? { default: "#121212", paper: "#1e1e1e" }
        : { default: "#f3f6fd", paper: "#fff" },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }} className={darkMode ? "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex flex-col items-center justify-center" : "bg-gradient-to-br from-blue-100 via-blue-300 to-white flex flex-col items-center justify-center"}>
        <Container maxWidth="md" className="py-8 px-4 md:px-0">
          <Box sx={{ py: 6, textAlign: "center" }} className="mb-8">
            <IconButton onClick={() => setDarkMode((prev) => !prev)} sx={{ position: 'absolute', right: 24, top: 24 }} color="primary">
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Typography variant="h3" fontWeight={700} color="primary" gutterBottom className={darkMode ? "text-5xl font-extrabold text-blue-300 drop-shadow-lg" : "text-5xl font-extrabold text-blue-700 drop-shadow-lg"}>
              🌊 Maritime Weather Intelligence
            </Typography>
            <Typography variant="h6" color="text.secondary" className={darkMode ? "text-lg text-blue-200" : "text-lg text-blue-600"}>
              Real-time weather, alerts, and forecasts for maritime operations
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ mb: 4 }} className="mb-8">
            <Grid item xs={12} md={6}>
              <BackendStatusPanel status={backendStatus} />
            </Grid>
            <Grid item xs={12} md={6}>
              <MLEngineStatusPanel status={mlStatus} />
            </Grid>
          </Grid>

          <Grid container spacing={4} sx={{ mb: 4 }} className="mb-8">
            <Grid item xs={12} md={6}>
              <WeatherPanel weather={weather} />
            </Grid>
            <Grid item xs={12} md={6}>
              <AlertsPanel alerts={alerts} />
            </Grid>
          </Grid>

          <ForecastSection forecast={forecast} theme={darkMode ? "dark" : "light"} />

          <Box sx={{ textAlign: "center", py: 4, mt: 6, bgcolor: "background.paper", borderRadius: 2 }} className={darkMode ? "mt-12 rounded-xl shadow-lg bg-gray-900/80" : "mt-12 rounded-xl shadow-lg bg-blue-100/80"}>
            <Typography variant="body2" color="text.secondary" className={darkMode ? "text-gray-400" : "text-blue-700"}>
              &copy; {new Date().getFullYear()} Maritime Weather Intelligence Hackathon
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
