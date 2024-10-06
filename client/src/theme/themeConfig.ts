// theme/themeConfig.ts
import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontSize: 16,
    colorPrimary: "#52c41a",
  },
  components: {
    Menu: {
      // We put a border on the menu container ourselves, get rid of the Antd one so we don't have duplicates
      activeBarBorderWidth: 0,
    },
  },
};

export default theme;
