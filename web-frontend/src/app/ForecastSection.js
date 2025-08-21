"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ForecastCard from "./ForecastCard";

export default function ForecastSection({ forecast, theme = 'light' }) {
  if (theme === 'light') {
    // Light mode combo
    return (
      <Box className="py-8 px-2 md:px-8 bg-gradient-to-br from-blue-100/60 to-blue-300/80 rounded-3xl shadow-lg">
        <Box className="flex items-center gap-3 mb-6">
          <WbSunnyIcon className="text-yellow-400" fontSize="large" />
          <Typography variant="h5" className="text-blue-700 font-bold">3-Day Forecast</Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {forecast.map((f, idx) => (
            <Grid item key={idx} className={idx !== 0 ? "border-l border-blue-300/40" : ""} style={{ display: 'flex', alignItems: 'stretch' }}>
              <ForecastCard {...f} theme="light" />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  } else {
    // Dark mode combo
    return (
      <Box className="py-8 px-2 md:px-8 bg-gradient-to-br from-blue-800/60 to-blue-900/80 rounded-3xl shadow-lg">
        <Box className="flex items-center gap-3 mb-6">
          <WbSunnyIcon className="text-yellow-400" fontSize="large" />
          <Typography variant="h5" className="text-blue-100 font-bold">3-Day Forecast</Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {forecast.map((f, idx) => (
            <Grid item key={idx} className={idx !== 0 ? "border-l border-gray-700/40" : ""} style={{ display: 'flex', alignItems: 'stretch' }}>
              <ForecastCard {...f} theme="dark" />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
}
