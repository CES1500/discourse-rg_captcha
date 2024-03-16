import { tracked } from "@glimmer/tracking";
import EmberObject from "@ember/object";
import Service from "@ember/service";
import { disableImplicitInjections } from "discourse/lib/implicit-injections";
import I18n from "I18n";

@disableImplicitInjections
export default class reCAPTCHAService extends Service {
  @tracked invalid = true;
  @tracked submitted = false;
  @tracked token = null;
  widgetId = null;
  reCAPTCHA = null;

  get submitFailed() {
    return this.submitted && this.invalid;
  }

  get inputValidation() {
    return EmberObject.create({
      failed: this.invalid,
      reason: I18n.t("discourse_reCAPTCHA.missing_token"),
    });
  }

  registerWidget(reCAPTCHA, id) {
    this.reCAPTCHA = reCAPTCHA;
    this.widgetId = id;
  }

  reset() {
    this.invalid = true;
    this.submitted = false;
    this.token = null;
    this.reCAPTCHA.reset(this.widgetId);
  }
}
