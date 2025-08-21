"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function ForecastPanel({ forecast, theme = 'light' }) {
  if (theme === 'light') {
    // Light mode combo
    return (
      <Card sx={{ mb: 2, bgcolor: "background.paper", borderRadius: 3, boxShadow: 4, transition: '0.2s', '&:hover': { boxShadow: 10, transform: 'scale(1.02)' } }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon color="info" fontSize="small" /> 3-Day Forecast
          </Typography>
          <Grid container spacing={2}>
            {forecast.map((f, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card sx={{ bgcolor: "#e3f2fd", color: "#1976d2", borderRadius: 3, boxShadow: 4, transition: '0.2s', '&:hover': { boxShadow: 10, transform: 'scale(1.03)' } }}>
                  <CardContent>
                    <Typography variant="subtitle1" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarMonthIcon fontSize="small" /> {f.day}
                    </Typography>
                    <Typography variant="body2">Temp: {f.temp}</Typography>
                    <Typography variant="body2">Wind: {f.wind}</Typography>
                    <Typography variant="body2">Wave: {f.wave}</Typography>
                    <Typography variant="body2">Summary: {f.summary}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  } else {
    // Dark mode combo
    return (
      <Card sx={{ mb: 2, bgcolor: "#1e1e1e", borderRadius: 3, boxShadow: 4, transition: '0.2s', '&:hover': { boxShadow: 10, transform: 'scale(1.02)' } }}>
        <CardContent>
          <Typography variant="h6" color="primary.light" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon color="info" fontSize="small" /> 3-Day Forecast
          </Typography>
          <Grid container spacing={2}>
            {forecast.map((f, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card sx={{ bgcolor: "#263238", color: "#90caf9", borderRadius: 3, boxShadow: 4, transition: '0.2s', '&:hover': { boxShadow: 10, transform: 'scale(1.03)' } }}>
                  <CardContent>
                    <Typography variant="subtitle1" color="primary.light" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarMonthIcon fontSize="small" /> {f.day}
                    </Typography>
                    <Typography variant="body2">Temp: {f.temp}</Typography>
                    <Typography variant="body2">Wind: {f.wind}</Typography>
                    <Typography variant="body2">Wave: {f.wave}</Typography>
                    <Typography variant="body2">Summary: {f.summary}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }
}
