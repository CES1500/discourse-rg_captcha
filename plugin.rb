# frozen_string_literal: true

# name: discourse-reCAPTCHA
# about: reCAPTCHA support for Discourse
# version: 0.0.1
# authors: Discourse
# url: https://github.com/discourse/discourse-reCAPTCHA
# required_version: 2.7.0

enabled_site_setting :discourse_reCAPTCHA_enabled

extend_content_security_policy(script_src: %w[https://www.google.com/recaptcha/about/])

module ::DiscoursereCAPTCHA
  PLUGIN_NAME = "discourse-reCAPTCHA"
end

require_relative "lib/discourse_rg_captcha/engine"

after_initialize do
  reloadable_patch do
    UsersController.class_eval { include DiscoursereCAPTCHA::CreateUsersControllerPatch }
  end
end
