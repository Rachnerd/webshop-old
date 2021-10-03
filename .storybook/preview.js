import "../src/globals.css";
import { defaultTheme } from "../src/theme/default";
import { ThemeProvider } from "styled-components";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    hideNoControlsWarning: true,
  },
  docs: {
    source: {
      type: "code",
    },
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: "iphone6",
  },
  options: {
    storySort: {
      method: "alphabetical",
      order: [
        "Docs",
        ["Intro", "Getting started", "Assignments overview"],
        "API",
        "Atoms",
        "Molecules",
        "Organisms",
        "Templates",
        "Pages",
      ],
    },
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={defaultTheme}>
      <Story />
    </ThemeProvider>
  ),
];
