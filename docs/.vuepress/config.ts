import { ThemeConfig } from "vuepress-theme-vt";
import { defineConfig4CustomTheme } from "vuepress/config";

export = defineConfig4CustomTheme<ThemeConfig>((ctx) => ({
  theme: "vt",
  title: "职念",
  themeConfig: {
    enableDarkMode: true,
    repo: "https://github.com/JobsessionDao/Jobsession",
    logo: "/logo.png",
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "API", link: "/api/" },
    ],
    sidebar: {
      "/guide/": [
        {
          title: "Guide",
          collapsable: false,
          children: [
            "/guide/guifan",
            "/guide/czh",
            "/guide/database",
            "/guide/databaseMethods",
            "/guide/git",
            "/guide/reachBottom",
          ],
        },
      ],
      "/api/": [
        {
          title: "Config",
          path: "/api/",
          collapsable: false,
          children: ["/api/utils", "/api/yuncunchu"],
        },
      ],
    },
    codeSwitcher: {
      groups: {
        default: { ts: "TypeScript", js: "JavaScript" },
        "plugin-usage": { tuple: "Tuple", object: "Object" },
      },
    },
  },
}));
