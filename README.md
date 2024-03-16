# Discourse reCAPTCHA Plugin

## Overview

This plugin is designed to integrate reCAPTCHA into the sign-up form of Discourse forums. This plugin aims to enhance security and bot protection by leveraging the privacy-centric features of reCAPTCHA. The setup process is straightforward and consists of a few easy steps.

## Installation

1. **Create an reCAPTCHA Account**:
   - Visit [reCAPTCHA](https://www.reCAPTCHA.com/) to create an account. After registering, you'll receive a site key and a secret key.

2. **Setup Local Testing** (Optional):
   - If you are testing locally, add a new virtual host entry to your hosts file. Include a line like `127.0.0.1 test.mydomain.com`. Make sure the domain is valid, even if you don't own it, to ensure the reCAPTCHA script loads properly.

3. **Configure Plugin Settings**:
   - Log into your Discourse admin panel.
   - Navigate to `Admin` > `Settings` > `Plugins` > `reCAPTCHA (settings)`.
   - In this section, add the site key and secret key you obtained from reCAPTCHA.

By completing these steps, you will successfully integrate reCAPTCHA into the sign-up form of your community.
