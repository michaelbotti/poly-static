import React from 'react';
import { RECAPTCHA_SITE_KEY } from './src/lib/constants';
import "./src/styles/global.css";

<script
  async
  key="recaptcha-script"
  src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
/>
