define(['handlebars', 'app/widget', 'text!templates/card.html'], function (H, Widget, CardTemplate) {
  return Widget('stack', {

    init: function (options) {
      var self = this;

      this.cardTemplate = H.compile(CardTemplate);

      this.sliceStart = 0;
      this.sliceLength = 4;
      this.candidates = 0;
      this.currentIndex = 0;

      this.on('fail pass', '.card', _.bind(this._onFailPass, this));
    },

    setCandidates: function (candidates) {
      this.$element.empty();

      this.candidates = candidates;
      this.sliceStart = 0;
      this.currentIndex = 0;
      this.prependSlice();
    },

    prependSlice: function () {
      var candidates = this.candidates.slice(this.sliceStart, this.sliceStart + this.sliceLength);
      this.sliceStart += this.sliceLength;

      _.each(candidates, function (candidate) {
        var card = $(this.cardTemplate({candidate: candidate}));
        card.data('candidate', candidate);
        this.$element.prepend(card);
      }, this);
    },

    nextCard: function () {
      this.currentIndex++;

      if (this.currentIndex + this.sliceLength > this.sliceStart) {
        this.prependSlice();
      }

      if (this.currentIndex == this.candidates.length) {
        var self = this;
        window.setTimeout(function () {
          self.$element.trigger('stackend');
        }, 0);
      }
    },

    _onFailPass: function (e) {
      this.nextCard();
    }

  });
});