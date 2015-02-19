define(['handlebars', 'app/widget', 'text!templates/card.html'], function (H, Widget, CardTemplate) {
  return Widget('stack', {

    init: function (options) {
      var self = this;

      this.cardTemplate = H.compile(CardTemplate);
      this.province = options.province;

      this.currentIndex = 0;
      this.sliceLength = 5;
      this.candidates = 0;

      this.on('fail pass', '.card', _.bind(this._onFailPass, this));

      this.load().then(function () {
        self.prependSlice();
        self.prependSlice();
      });
    },

    load: function () {
      var self = this;
      return $.getJSON('/candidates/stack?province=Flevoland').then(function (candidates) {
        self.candidates = candidates;
      });
    },

    prependSlice: function () {
      var candidates = this.candidates.slice(this.currentIndex, this.currentIndex + this.sliceLength);
      this.currentIndex += this.sliceLength;

      _.each(candidates, function (candidate) {
        var card = this.cardTemplate({candidate: candidate});
        this.$element.prepend(card);
      }, this);
    },

    _onFailPass: function () {
      var visibleCards = this.$element.children();

      if (visibleCards.length <= this.sliceLength && this.currentIndex < this.candidates.length) {
        this.prependSlice();
      }
    }

  });
});