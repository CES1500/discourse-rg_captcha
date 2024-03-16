# frozen_string_literal: true

module ::DiscoursereCAPTCHA
  class Engine < ::Rails::Engine
    engine_name PLUGIN_NAME
    isolate_namespace DiscoursereCAPTCHA
    config.autoload_paths << File.join(config.root, "lib")
  end
end
