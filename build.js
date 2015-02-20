({
    baseUrl: 'js/lib',
    urlArgs: 'v=' + (new Date().getTime()),
    deps: [
      'modernizr',
      'jquery-ui',
      'text!templates/province-chooser.html',
      'text!templates/card.html'
    ],
    paths: {
      main:       '../main',
      app:        '../app',
      templates:  '../../templates',
      assets:     '../../assets'
    },
    shim: {
      'jquery-ui': {
        deps: ['jquery']
      },
      'jquery.livequery': {
        deps: ['jquery']
      }
    },

    name: "main",
    out: "js/main-built.js"
})
