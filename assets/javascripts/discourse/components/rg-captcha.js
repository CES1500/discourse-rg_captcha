import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { next } from "@ember/runloop";
import { inject as service } from "@ember/service";
import loadScript from "discourse/lib/load-script";

const reCAPTCHA_SCRIPT_URL = "https://www.recaptcha.net/recaptcha/api.js?render=explicit";

export default class reCAPTCHA extends Component {
  @service reCAPTCHAService;

  @tracked widgetId;
  @tracked invalid = true;
  reCAPTCHA;

  constructor() {
    super(...arguments);
    this.initializereCAPTCHA(this.args.siteKey);
  }

  initializereCAPTCHA(siteKey) {
    if (this.isreCAPTCHALoaded()) {
      next(() => {
        if (document.getElementById("rg-captcha-field")) {
          this.renderreCAPTCHA(siteKey);
        }
      });
      return;
    }

    this.loadreCAPTCHAScript(siteKey);
  }

  isreCAPTCHALoaded() {
    return typeof this.reCAPTCHA !== "undefined";
  }

  async loadreCAPTCHAScript(siteKey) {
    await loadScript(reCAPTCHA_SCRIPT_URL);
    this.reCAPTCHA = window.reCAPTCHA;
    this.renderreCAPTCHA(siteKey);
  }

  renderreCAPTCHA(siteKey) {
    if (!this.isreCAPTCHALoaded()) {
      throw new Error("reCAPTCHA is not defined");
    }

    this.widgetId = this.reCAPTCHA.render("rg-captcha-field", {
      sitekey: siteKey,
      callback: (response) => {
        this.reCAPTCHAService.token = response;
        this.reCAPTCHAService.invalid = !response;
      },
      "expired-callback": () => {
        this.reCAPTCHAService.invalid = true;
      },
    });

    this.reCAPTCHAService.registerWidget(this.reCAPTCHA, this.widgetId);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    if (this.isreCAPTCHALoaded()) {
      this.reCAPTCHA.reset(this.widgetId);
    }
  }
}
