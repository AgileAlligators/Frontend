module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData:
          "@import '@/scss/_variables.scss';\n@import '@/scss/_mixins.scss';",
      },
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/i,
          loader: 'raw-loader',
        },
      ],
    },
  },
  pwa: {
    workboxPluginMode: 'GenerateSW',
    manifestOptions: {
      display: 'fullscreen',
      start_url: '.',
      icons: [
        {
          src: 'pwa/splash/manifest-icon-512.png',
          size: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa/splash/manifest-icon-512.png',
          size: '384x384',
          type: 'image/png',
        },
      ],
    },
    name: 'AA Frontend',
    themeColor: '#dc2626',
    msTileColor: '#dc2626',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    iconPaths: {
      favicon32: 'pwa/logo.svg',
      favicon16: 'pwa/logo.svg',
      appleTouchIcon: 'pwa/splash/manifest-icon-512.png',
      maskIcon: 'pwa/logo.svg',
      msTileImage: 'pwa/splash/manifest-icon-512.png',
    },
    icons: [
      {
        src: 'pwa/splash/manifest-icon-512.png',
        size: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa/splash/manifest-icon-512.png',
        size: '384x384',
        type: 'image/png',
      },
    ],
  },
};
