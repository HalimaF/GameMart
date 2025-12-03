import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <TextField
      fullWidth
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
