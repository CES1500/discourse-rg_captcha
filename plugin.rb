# frozen_string_literal: true

# name: discourse-rg_captcha
# about: rg_captcha support for Discourse
# version: 0.0.1
# authors: Discourse
# url: https://github.com/discourse/discourse-rg_captcha
# required_version: 2.7.0

enabled_site_setting :discourse_rg_captcha_enabled

extend_content_security_policy(script_src: %w[https://rg_captcha.com])

module ::Discourserg_captcha
  PLUGIN_NAME = "discourse-rg_captcha"
end

require_relative "lib/discourse_h_captcha/engine"

after_initialize do
  reloadable_patch do
    UsersController.class_eval { include Discourserg_captcha::CreateUsersControllerPatch }
  end
end
