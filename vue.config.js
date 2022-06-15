module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData:
          "@import '@/scss/_variables.scss';\n@import '@/scss/_mixins.scss';",
      },
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
    name: 'Track+',
    themeColor: '#419F52',
    msTileColor: '#419F52',
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
