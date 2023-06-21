import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Heebo", "sans-serif"].join(","),
  },
});

theme.typography.body1 = {
  fontSize: "1rem",
};

theme.typography.body2 = {
  fontSize: "0.9rem",
};

export default theme;
