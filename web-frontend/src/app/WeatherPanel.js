"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CloudIcon from "@mui/icons-material/Cloud";
import WavesIcon from "@mui/icons-material/Waves";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";

export default function WeatherPanel({ weather }) {
  return (
  <Card sx={{ mb: 2, bgcolor: "background.paper", borderRadius: 3, boxShadow: 4, transition: '0.2s', '&:hover': { boxShadow: 10, transform: 'scale(1.02)' } }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudIcon color="primary" fontSize="small" /> Current Weather
        </Typography>
        {weather ? (
          <Grid container spacing={2}>
            <Grid item xs={6} md={2}><Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CloudIcon fontSize="small" /> {weather.location}</Typography></Grid>
            <Grid item xs={6} md={2}><Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><ThermostatIcon fontSize="small" /> {weather.temperature}</Typography></Grid>
            <Grid item xs={6} md={2}><Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><AirIcon fontSize="small" /> {weather.wind}</Typography></Grid>
            <Grid item xs={6} md={2}><Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><WavesIcon fontSize="small" /> {weather.wave}</Typography></Grid>
            <Grid item xs={6} md={4}><Typography variant="body2">Forecast: {weather.forecast}</Typography></Grid>
          </Grid>
        ) : (
          <Typography variant="body2">Loading...</Typography>
        )}
      </CardContent>
    </Card>
  );
}
