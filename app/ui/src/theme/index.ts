import { generateColors } from "@mantine/colors-generator";
import { createTheme } from "@mantine/core";

const theme = createTheme({
  autoContrast: true,
  luminanceThreshold: 0.3,
  cursorType: "pointer",
  primaryShade: 9,
  fontSmoothing: true,
  primaryColor: "deepGreen",
  colors: {
    deepGreen: generateColors("#2c8a77"),
  },
});

export default theme;
