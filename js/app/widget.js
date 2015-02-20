/**
 * Stateful widgets, like jQuery UI's widget, but these widgets are AMD-based. They return a function which
 * can be executed on any element. The element will obtain an instance of the widget class, which is stored
 * in a $.data variable.
 */
define(['underscore', 'jquery'], function (_, $) {

  var Widget = function () {
  };

  Widget.prototype = {

    find: function () {
      return $.fn.find.apply(this.$element, arguments);
    },

    on: function () {
      return $.fn.on.apply(this.$element, arguments);
    },

    off: function () {
      return $.fn.off.apply(this.$element, arguments);
    }

  };

  Widget.prototype.$ = Widget.prototype.find;

  // This function retrieves a widget by name.
  $.fn.widget = function (name) {
    return this.data('app.widgets.' + name);
  };

  // Return a widget creator which creates a derived class of the Widget class.
  return function createWidget(name, proto) {

    var camelizedName = name.replace (/(?:[-_])(\w)/g, function (_, c) {
      return c ? c.toUpperCase () : '';
    });

    var widget = function (element, options) {
      var self = this;

      this.$element = $(element);
      this.$element.data('app.widgets.' + name, this);

      if (this.init) {
        this.init(options);
      }

      if (this.destroy) {
        this.$element.on('remove', function () {
          self.destroy();
          self.$element.removeData('app.widgets.' + name);
        });
      }
    };

    widget.prototype = new Widget();
    _.extend(widget.prototype, proto);
    widget.name = name;

    return widget;

  };

});