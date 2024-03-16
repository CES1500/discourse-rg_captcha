import { Promise } from "rsvp";
import { ajax } from "discourse/lib/ajax";
import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwnerWithFallback } from "discourse-common/lib/get-owner";

const PLUGIN_ID = "discourse-hCaptcha";

function initializeHCaptcha(api, container) {
  const siteSettings = container.lookup("service:site-settings");

  if (!siteSettings.discourse_hCaptcha_enabled) {
    return;
  }

  api.modifyClassStatic("model:user", {
    pluginId: PLUGIN_ID,

    createAccount() {
      const hCaptchaService = getOwnerWithFallback(this).lookup(
        "service:g-recaptcha-service"
      );
      hCaptchaService.submitted = true;

      if (hCaptchaService.invalid) {
        return Promise.reject();
      }

      const data = {
        token: hCaptchaService.token,
      };

      const originalAccountCreation = this._super;
      return ajax("/hcaptcha/create.json", {
        data,
        type: "POST",
      })
        .then(() => {
          return originalAccountCreation(...arguments);
        })
        .catch(() => {
          hCaptchaService.failed = true;
          return Promise.reject();
        })
        .finally(() => {
          hCaptchaService.reset();
        });
    },
  });
}

export default {
  name: PLUGIN_ID,

  initialize(container) {
    withPluginApi("1.9.0", (api) => initializeHCaptcha(api, container));
  },
};
