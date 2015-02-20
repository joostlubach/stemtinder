define(['underscore', 'app/widget'], function (_, Widget) {
  return Widget('province-chooser', {

    init: function () {
      this.province = 'Flevoland';

      this.on('click', 'li', _.bind(this._onItemClick, this));
    },

    reset: function () {
      this.find('li').removeClass('selected');
    },

    _onItemClick: function (e) {
      var item     = $(e.currentTarget),
          province = item.attr('data-province');

      this.province = province;
      this.find('li').removeClass('selected');
      item.addClass('selected');

      this.$element.trigger('choose');
    }

  });
});