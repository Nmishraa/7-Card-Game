const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const defaultRewrite = config.server?.rewriteRequestUrl || ((url) => url);
config.server = {
  ...config.server,
  rewriteRequestUrl: (url) => {
    let clean = url;
    if (typeof clean === 'string' && clean.startsWith('//')) {
      clean = clean.replace(/^\/+/, '/');
    }
    return defaultRewrite(clean);
  }
};

module.exports = config;
