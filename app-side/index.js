import { BaseSideService, settingsLib } from "@zeppos/zml/base-side";
import { MSG_SETTINGS_UPDATE, MSG_SETTINGS_GET } from "../utils/messaging.js";

AppSideService(
  BaseSideService({
    onInit() {},
    onRun() {},
    onDestroy() {},
    onSettingsChange({ key, newValue }) {
      if (key === "debugUI") {
        this.call({ type: MSG_SETTINGS_UPDATE, debugUI: newValue === "true" });
      }
    },
    onRequest(req, res) {
      if (req.method === MSG_SETTINGS_GET) {
        const val = settingsLib.getItem("debugUI");
        res(null, { debugUI: val === "true" });
      }
    },
  }),
);
