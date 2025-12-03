import { useState } from "react";
import { Box, Paper, Typography, IconButton, Tooltip } from "@mui/material";
import { FiMaximize as FullscreenIcon, FiMinimize as FullscreenExitIcon } from "react-icons/fi";


const isSameOrigin = (url) => {
  try {
    const u = new URL(url, window.location.origin);
    return u.origin === window.location.origin;
  } catch {
    return false;
  }
};

const hostFromUrl = (url) => {
  try {
    const u = new URL(url, window.location.origin);
    return u.hostname;
  } catch {
    return "";
  }
};

const EmbeddedMiniGame = ({
  src,
  title = "Embedded Mini Game",
  aspectRatio = "16 / 9",
  allowSameOriginSandbox = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const allowed = !!src;

  const sandboxFlags = (() => {
    const flags = [
      "allow-scripts",
      "allow-pointer-lock",
      "allow-popups",
      "allow-forms",
      "allow-modals",
      "allow-downloads",
    ];
    if (allowSameOriginSandbox || isSameOrigin(src)) flags.push("allow-same-origin");
    return flags.join(" ");
  })();

  const containerId = (() => {
    const base = `emg-${(title || src || "game").toString()}`;
    return base.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  })();

  const handleToggleFullscreen = async () => {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!document.fullscreenElement) {
      try {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } catch {}
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch {}
    }
  };

  if (!src) {
    return (
      <Paper sx={{ p: 2, background: "#0b1220", border: "1px solid #30363d" }}>
        <Typography sx={{ color: "#e5e7eb" }}>No game selected.</Typography>
      </Paper>
    );
  }

  // ...existing code...

  return (
    <Paper sx={{ p: 1.5, background: "#0b1220", border: "1px solid #30363d" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography sx={{ color: "#e5e7eb", fontWeight: 600, flex: 1 }}>
          {title}
        </Typography>
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
          <IconButton onClick={handleToggleFullscreen} size="small" sx={{ color: "#9ca3af" }}>
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        id={containerId}
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio,
          background: "#111827",
          border: "1px solid #30363d",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Box
          component="iframe"
          title={title}
          src={src}
          allow="autoplay; fullscreen; gamepad *; xr-spatial-tracking"
          sandbox={sandboxFlags}
          loading="lazy"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
            background: "#000",
          }}
        />
      </Box>
    </Paper>
  );
};

export default EmbeddedMiniGame;
