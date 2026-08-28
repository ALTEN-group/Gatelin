import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import FrogFace from "./FrogFace.vue";

// The home hero takes its image from frontmatter, which can only name a file.
// Filling the slot from here is what puts a live canvas there instead, and what
// tells VPHero to lay the hero out in two columns at all.
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "home-hero-image": () => h(FrogFace),
    });
  },
};
