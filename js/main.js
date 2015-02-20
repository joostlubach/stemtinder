requirejs.config({
    baseUrl: 'js/lib',
    urlArgs: 'v=' + (new Date().getTime()),
    deps: ['modernizr', 'jquery-ui'],
    paths: {
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
    }
});

require(['jquery', 'app/behavior', 'app', 'app/widget'], function ($, behavior, App) {

  // Automatically include templates.
  behavior('[data-include]', function () {
    var $element     = $(this),
        templatePath = $element.attr('data-include');

    require(['text!' + templatePath], function (template) {
      $element.html(template);
    });
  });

  // Automatically run widgets.
  behavior('[data-widget]', function () {
    var $element = $(this),
        widgets  = $element.attr('data-widget').split(' ');

    _.each(widgets, function (name) {
      if (!$element.widget(name)) {
        require(['app/widgets/' + name], function (widget) {
          new widget($element);
        });
      }
    });

  });

  window.app = new App();

});

