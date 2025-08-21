"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function AlertsPanel({ alerts }) {
  return (
  <Card sx={{ mb: 2, bgcolor: "background.paper", borderRadius: 3, boxShadow: 4, transition: '0.2s', '&:hover': { boxShadow: 10, transform: 'scale(1.02)' } }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="warning" fontSize="small" /> Alerts
        </Typography>
        {alerts.length > 0 ? (
          <List>
            {alerts.map((alert, idx) => (
              <ListItem key={idx}>
                <Typography variant="body2" color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WarningAmberIcon fontSize="small" /> {alert.type}: {alert.message}
                </Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2">No alerts.</Typography>
        )}
      </CardContent>
    </Card>
  );
}
