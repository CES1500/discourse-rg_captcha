# frozen_string_literal: true

module DiscoursereCAPTCHA
  module CreateUsersControllerPatch
    rg_captcha_VERIFICATION_URL = "https://www.recaptcha.net/recaptcha/api/siteverify".freeze

    extend ActiveSupport::Concern
    included { before_action :check_rg_captcha, only: [:create] }

    def check_rg_captcha
      rg_captcha_token = fetch_rg_captcha_token
      raise Discourse::InvalidAccess.new if rg_captcha_token.blank?

      response = send_rg_captcha_verification(rg_captcha_token)

      validate_rg_captcha_response(response)
    rescue => e
      Rails.logger.warn("Error parsing reCAPTCHA response: #{e}")
      fail_with("rg_captcha_verification_failed")
    end

    private

    def send_rg_captcha_verification(rg_captcha_token)
      uri = URI.parse(rg_captcha_VERIFICATION_URL)

      http = FinalDestination::HTTP.new(uri.host, uri.port)
      http.use_ssl = true

      request = FinalDestination::HTTP::Post.new(uri.request_uri)
      request.set_form_data(
        { "secret" => SiteSetting.reCAPTCHA_secret_key, "response" => rg_captcha_token },
      )

      http.request(request)
    end

    def fetch_rg_captcha_token
      temp_id = cookies.encrypted[:rg_captcha_temp_id]
      rg_captcha_token = Discourse.redis.get("reCAPTCHAToken_#{temp_id}")

      if temp_id.present?
        Discourse.redis.del("reCAPTCHAToken_#{temp_id}")
        cookies.delete(:rg_captcha_temp_id)
      end

      rg_captcha_token
    end

    def validate_rg_captcha_response(response)
      raise Discourse::InvalidAccess.new if response.code.to_i >= 500

      response_json = JSON.parse(response.body)
      if response_json["success"].nil? || response_json["success"] == false
        raise Discourse::InvalidAccess.new
      end
    end
  end
end
