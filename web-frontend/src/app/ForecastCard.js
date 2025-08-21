"use client";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import WaterIcon from "@mui/icons-material/Water";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const weatherIcon = (summary) => {
  if (summary.toLowerCase().includes("sun")) return <WbSunnyIcon className="text-yellow-400" />;
  if (summary.toLowerCase().includes("cloud")) return <CloudIcon className="text-blue-300" />;
  if (summary.toLowerCase().includes("thunder")) return <ThunderstormIcon className="text-purple-400" />;
  if (summary.toLowerCase().includes("rain")) return <WaterIcon className="text-blue-400" />;
  return <WbSunnyIcon className="text-yellow-400" />;
};

export default function ForecastCard({ day, temp, wind, wave, summary, theme }) {
  // theme: 'light' | 'dark'
  if (theme === 'light') {
    // Current UI for light mode
    return (
      <Grid item xs={12} sm={6} md={4} className="flex justify-center">
        <Card
          className="forecast-card rounded-2xl transition-transform duration-200 hover:scale-105 w-56 max-w-xs p-3 gap-2 bg-[rgba(255,255,255,0.85)]"
          sx={{
            boxShadow: '0 2px 12px 0 rgba(60,80,180,0.08)',
            borderRadius: 4,
            minWidth: 200,
            maxWidth: 224,
            height: '100%',
          }}
        >
          <CardHeader
            avatar={<CalendarMonthIcon className="text-blue-500" fontSize="small" />}
            title={<Typography variant="subtitle1" className="text-blue-700 font-bold text-base">{day}</Typography>}
            sx={{ pb: 0, alignItems: 'center', minHeight: 40 }}
          />
          <CardContent className="flex flex-col gap-2 px-2 py-1">
            <Box className="flex items-center gap-2 justify-center mb-1 card-summary">
              {weatherIcon(summary)}
              <Typography variant="body2" className="text-blue-900 text-sm">{summary}</Typography>
            </Box>
            <Divider variant="middle" flexItem className="my-2 border-gray-700/40" />
            <Box className="flex flex-row gap-3 justify-center items-center card-stats">
              <Box className="flex flex-col items-center">
                <Typography variant="h6" className="text-blue-700 font-bold text-base">{temp}</Typography>
                <Typography variant="caption" color="text.secondary">Temp</Typography>
              </Box>
              <Box className="flex flex-col items-center">
                <Typography variant="subtitle2" className="font-bold text-blue-700 text-sm">{wind}</Typography>
                <Typography variant="caption" color="text.secondary">Wind</Typography>
              </Box>
              <Box className="flex flex-col items-center">
                <Typography variant="subtitle2" className="font-bold text-blue-700 text-sm">{wave}</Typography>
                <Typography variant="caption" color="text.secondary">Wave</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  } else if (theme === 'dark-white') {
    // Dark mode with all white text
    return (
      <Grid item xs={12} sm={6} md={4} className="flex justify-center">
        <Card
          className="forecast-card rounded-2xl transition-transform duration-200 hover:scale-105 w-56 max-w-xs p-3 gap-2 bg-[rgba(30,34,54,0.72)] backdrop-blur-md"
          sx={{
            boxShadow: '0 2px 12px 0 rgba(30,40,80,0.18)',
            borderRadius: 4,
            minWidth: 200,
            maxWidth: 224,
            height: '100%',
            backdropFilter: 'blur(8px)',
          }}
        >
          <CardHeader
            avatar={<CalendarMonthIcon className="text-white" fontSize="small" />}
            title={<Typography variant="subtitle1" className="text-white font-bold text-base">{day}</Typography>}
            sx={{ pb: 0, alignItems: 'center', minHeight: 40 }}
          />
          <CardContent className="flex flex-col gap-2 px-2 py-1">
            <Box className="flex items-center gap-2 justify-center mb-1 card-summary">
              {weatherIcon(summary)}
              <Typography variant="body2" className="text-white text-sm">{summary}</Typography>
            </Box>
            <Divider variant="middle" flexItem className="my-2 border-gray-700/40" />
            <Box className="flex flex-row gap-3 justify-center items-center card-stats">
              <Box className="flex flex-col items-center">
                <Typography variant="h6" className="text-white font-bold text-base">{temp}</Typography>
                <Typography variant="caption" className="text-white">Temp</Typography>
              </Box>
              <Box className="flex flex-col items-center">
                <Typography variant="subtitle2" className="font-bold text-white text-sm">{wind}</Typography>
                <Typography variant="caption" className="text-white">Wind</Typography>
              </Box>
              <Box className="flex flex-col items-center">
                <Typography variant="subtitle2" className="font-bold text-white text-sm">{wave}</Typography>
                <Typography variant="caption" className="text-white">Wave</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  } else {
    // Previous compact glassy UI for dark mode (fallback)
    return (
      <Grid item xs={12} sm={6} md={4} className="flex justify-center">
        <Card
          className="forecast-card rounded-2xl transition-transform duration-200 hover:scale-105 w-56 max-w-xs p-3 gap-2 bg-[rgba(30,34,54,0.72)] backdrop-blur-md"
          sx={{
            boxShadow: '0 2px 12px 0 rgba(30,40,80,0.18)',
            borderRadius: 4,
            minWidth: 200,
            maxWidth: 224,
            height: '100%',
            backdropFilter: 'blur(8px)',
          }}
        >
          <CardHeader
            avatar={<CalendarMonthIcon className="text-blue-300" fontSize="small" />}
            title={<Typography variant="subtitle1" className="text-blue-200 font-bold text-base">{day}</Typography>}
            sx={{ pb: 0, alignItems: 'center', minHeight: 40 }}
          />
          <CardContent className="flex flex-col gap-2 px-2 py-1">
            <Box className="flex items-center gap-2 justify-center mb-1 card-summary">
              {weatherIcon(summary)}
              <Typography variant="body2" className="text-white text-sm">{summary}</Typography>
            </Box>
            <Divider variant="middle" flexItem className="my-2 border-gray-700/40" />
            <Box className="flex flex-row gap-3 justify-center items-center card-stats">
              <Box className="flex flex-col items-center">
                <Typography variant="h6" className="text-blue-100 font-bold text-base">{temp}</Typography>
                <Typography variant="caption" color="text.secondary">Temp</Typography>
              </Box>
              <Box className="flex flex-col items-center">
                <Typography variant="subtitle2" className="font-bold text-blue-100 text-sm">{wind}</Typography>
                <Typography variant="caption" color="text.secondary">Wind</Typography>
              </Box>
              <Box className="flex flex-col items-center">
                <Typography variant="subtitle2" className="font-bold text-blue-100 text-sm">{wave}</Typography>
                <Typography variant="caption" color="text.secondary">Wave</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}
