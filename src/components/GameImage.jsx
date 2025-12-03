import { CardMedia } from "@mui/material";

const GameImage = ({ src, alt, height = 200 }) => {
  return <CardMedia component="img" height={height} image={src} alt={alt} />;
};

export default GameImage;
