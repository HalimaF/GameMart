import { Box, Button } from "@mui/material";

const MiniGameControls = ({ onStart, onPause, onReset, isPlaying }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {!isPlaying ? (
        <Button variant="contained" onClick={onStart}>Start</Button>
      ) : (
        <Button variant="outlined" onClick={onPause}>Pause</Button>
      )}
      <Button variant="outlined" onClick={onReset}>Reset</Button>
    </Box>
  );
};

export default MiniGameControls;
