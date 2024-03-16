import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { next } from "@ember/runloop";
import { inject as service } from "@ember/service";
import loadScript from "discourse/lib/load-script";

const HCAPTCHA_SCRIPT_URL = "https://www.recaptcha.net/recaptcha/api.js?render=explicit";

export default class HCaptcha extends Component {
  @service hCaptchaService;

  @tracked widgetId;
  @tracked invalid = true;
  hCaptcha;

  constructor() {
    super(...arguments);
    this.initializeHCaptcha(this.args.siteKey);
  }

  initializeHCaptcha(siteKey) {
    if (this.isHCaptchaLoaded()) {
      next(() => {
        if (document.getElementById("g-recaptcha-field")) {
          this.renderHCaptcha(siteKey);
        }
      });
      return;
    }

    this.loadHCaptchaScript(siteKey);
  }

  isHCaptchaLoaded() {
    return typeof this.hCaptcha !== "undefined";
  }

  async loadHCaptchaScript(siteKey) {
    await loadScript(HCAPTCHA_SCRIPT_URL);
    this.hCaptcha = window.hcaptcha;
    this.renderHCaptcha(siteKey);
  }

  renderHCaptcha(siteKey) {
    if (!this.isHCaptchaLoaded()) {
      throw new Error("hCaptcha is not defined");
    }

    this.widgetId = this.hCaptcha.render("g-recaptcha-field", {
      sitekey: siteKey,
      callback: (response) => {
        this.hCaptchaService.token = response;
        this.hCaptchaService.invalid = !response;
      },
      "expired-callback": () => {
        this.hCaptchaService.invalid = true;
      },
    });

    this.hCaptchaService.registerWidget(this.hCaptcha, this.widgetId);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    if (this.isHCaptchaLoaded()) {
      this.hCaptcha.reset(this.widgetId);
    }
  }
}
