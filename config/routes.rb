# frozen_string_literal: true

DiscoursereCAPTCHA::Engine.routes.draw { post "/create" => "rg_captcha#create" }

Discourse::Application.routes.draw { mount ::DiscoursereCAPTCHA::Engine, at: "reCAPTCHA" }
