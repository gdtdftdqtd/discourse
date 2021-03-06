import { later } from "@ember/runloop";
import { isAppWebview, postRNWebviewMessage } from "discourse/lib/utilities";

// Send bg color to webview so iOS status bar matches site theme
export default {
  name: "webview-background",
  after: "inject-objects",

  initialize() {
    if (isAppWebview()) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addListener(this.updateAppBackground);
      this.updateAppBackground();
    }
  },
  updateAppBackground() {
    later(() => {
      const header = document.querySelector(".d-header-wrap .d-header");
      if (header) {
        const styles = window.getComputedStyle(header);
        postRNWebviewMessage("headerBg", styles.backgroundColor);
      }
    }, 500);
  },
};
