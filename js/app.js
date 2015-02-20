define(['app/stack', 'app/province-chooser'], function (Stack, ProvinceChooser) {

  var App = function () {
    this.votes = {};
    this.province = 'Flevoland';

    $('#buttons').on('click', '[data-vote]', _.bind(this._onVoteButtonClick, this));

    this.provinceChooser = new ProvinceChooser('#province-chooser');
    this.provinceChooser.on('choose', _.bind(this._onProvinceChoose, this));

    this.stack = new Stack('#stack');
    this.stack.on('fail pass', '.card', _.bind(this._onFailPass, this));
    this.stack.on('stackend', _.bind(this._onStackEnd, this));

    // this.provinceChooser.province = 'Zuid-Holland';
    // this._onProvinceChoose();
  };

  App.prototype = {

    vote: function (vote) {
      var candidate = this.stack.find('.card:last-child').data('candidate');
      this.votes[candidate.id] = vote;
    },

    save: function () {
      $.post(
        '/results',
        JSON.stringify({
          result: {
            province: this.province,
            votes:    this.votes
          }
        }),
        function () {},
        'json'
      );
    },

    _onProvinceChoose: function () {
      this.stack.load(this.provinceChooser.province);

      this.provinceChooser.$element.animate({
        top: '-=300',
        opacity: 0
      }, {
        duration: 500,
        easing: 'easeInBack',
        complete: function () {
          $(this).hide().css({opacity: '', top: ''});
        }
      });
    },

    _onVoteButtonClick: function (e) {
      var button = $(e.currentTarget),
          vote   = button.attr('data-vote');

      this.vote(vote);
      this.stack.find('.card:last-child').widget('card').dismiss(vote);
      this.stack.nextCard();
    },

    _onFailPass: function (e) {
      this.vote(e.type);
    },

    _onStackEnd: function (e) {
      this.save();
    }

  };

  return App;

});