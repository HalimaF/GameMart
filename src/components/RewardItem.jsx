import { Box, LinearProgress, Typography, Button } from "@mui/material";

const RewardItem = ({ mission, onClaim }) => {
  const progress = Math.min(100, Math.round((mission.current / mission.target) * 100));
  const canClaim = progress === 100 && !mission.claimed;

  return (
    <Box sx={{ p: 2, border: '1px solid #30363d', borderRadius: 2, background: '#0b1220', display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ color: '#e5e7eb', fontWeight: 600 }}>{mission.title}</Typography>
        <Typography sx={{ color: '#9ca3af', mb: 1 }}>{mission.description}</Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        <Typography sx={{ color: '#9ca3af', mt: 0.5 }}>{mission.current} / {mission.target}</Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ color: '#fde68a' }}>+{mission.rewardCoins} coins</Typography>
        <Typography sx={{ color: '#93c5fd' }}>+{mission.rewardXP} XP</Typography>
        <Button variant="contained" sx={{ mt: 1 }} disabled={!canClaim} onClick={() => onClaim?.(mission.id)}>
          {mission.claimed ? 'Claimed' : canClaim ? 'Claim' : 'In Progress'}
        </Button>
      </Box>
    </Box>
  );
};

export default RewardItem;
