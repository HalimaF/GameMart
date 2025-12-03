import { Paper, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";

const FilterPanel = ({ filters = [], selected = [], onChange }) => {
  return (
    <Paper sx={{ p: 2, background: '#0b1220', border: '1px solid #30363d' }}>
      <Typography variant="h6" sx={{ color: '#e5e7eb', mb: 2 }}>Filters</Typography>
      <FormGroup>
        {filters.map(f => (
          <FormControlLabel
            key={f.value}
            control={<Checkbox checked={selected.includes(f.value)} onChange={() => onChange?.(f.value)} />}
            label={f.label}
          />
        ))}
      </FormGroup>
    </Paper>
  );
};

export default FilterPanel;
