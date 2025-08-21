"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

export default function MLEngineStatusPanel({ status }) {
  const isRunning = typeof status === 'string' && status.toLowerCase().includes('running');
  return (
    <Card sx={{ mb: 2, bgcolor: "background.paper", borderRadius: 3, boxShadow: 4, transition: '0.2s', '&:hover': { boxShadow: 10, transform: 'scale(1.02)' } }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          ML Engine Status {isRunning ? <PlayCircleIcon color="success" fontSize="small" /> : status === "ok" ? <CheckCircleIcon color="success" fontSize="small" /> : <ErrorIcon color="error" fontSize="small" />}
        </Typography>
        <Typography variant="body1" color={isRunning ? "success.main" : status === "ok" ? "success.main" : "error.main"} fontWeight={600}>
          {status}
        </Typography>
      </CardContent>
    </Card>
  );
}
