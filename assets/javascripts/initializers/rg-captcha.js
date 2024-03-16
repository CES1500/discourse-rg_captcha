import { Promise } from "rsvp";
import { ajax } from "discourse/lib/ajax";
import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwnerWithFallback } from "discourse-common/lib/get-owner";

const PLUGIN_ID = "discourse-reCAPTCHA";

function initializereCAPTCHA(api, container) {
  const siteSettings = container.lookup("service:site-settings");

  if (!siteSettings.discourse_reCAPTCHA_enabled) {
    return;
  }

  api.modifyClassStatic("model:user", {
    pluginId: PLUGIN_ID,

    createAccount() {
      const reCAPTCHAService = getOwnerWithFallback(this).lookup(
        "service:rg-captcha-service"
      );
      reCAPTCHAService.submitted = true;

      if (reCAPTCHAService.invalid) {
        return Promise.reject();
      }

      const data = {
        token: reCAPTCHAService.token,
      };

      const originalAccountCreation = this._super;
      return ajax("/reCAPTCHA/create.json", {
        data,
        type: "POST",
      })
        .then(() => {
          return originalAccountCreation(...arguments);
        })
        .catch(() => {
          reCAPTCHAService.failed = true;
          return Promise.reject();
        })
        .finally(() => {
          reCAPTCHAService.reset();
        });
    },
  });
}

export default {
  name: PLUGIN_ID,

  initialize(container) {
    withPluginApi("1.9.0", (api) => initializereCAPTCHA(api, container));
  },
};
