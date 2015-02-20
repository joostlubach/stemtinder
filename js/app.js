define(['handlebars', 'app/stack', 'app/province-chooser', 'text!templates/result.html'], function (H, Stack, ProvinceChooser, ResultTemplate) {

  var App = function () {
    this.votes = {};
    this.parties = {};
    this.passesByParty = {};
    this.resultTemplate = H.compile(ResultTemplate);

    $('#buttons').on('click', '[data-vote]', _.bind(this._onVoteButtonClick, this));
    $('#result').on('click', '[data-action="again"]', _.bind(this._onAgainButtonClick, this));

    this.provinceChooser = new ProvinceChooser('#province-chooser');
    this.provinceChooser.on('choose', _.bind(this._onProvinceChoose, this));

    this.stack = new Stack('#stack');
    this.stack.on('fail pass', '.card', _.bind(this._onFailPass, this));
    this.stack.on('stackend', _.bind(this._onStackEnd, this));
  };

  App.prototype = {

    reset: function () {
      this.votes = {};
      this.parties = {};
      this.passesByParty = {};
      this.provinceChooser.reset();

      this.provinceChooser.$element.fadeIn(function () {
        $('#result').hide();
      });
    },

    vote: function (vote) {
      var candidate = this.stack.find('.card:last-child').data('candidate');
      this.votes[candidate.id] = vote;

      if (vote == 'pass') {
        var partyId = candidate.party_id;
        if (!this.passesByParty[partyId]) {
          this.passesByParty[partyId] = 0;
        }
        this.passesByParty[partyId]++;
      }
    },

    load: function (province) {
      var self = this;

      return $.getJSON('/candidates?province=' + province).then(function (data) {
        self.parties = self.indexById(data.parties);
        self.stack.setCandidates(data.candidates);
      });
    },

    indexById: function (array) {
      var index = {};
      _.each(array, function (item) {
        index[item.id] = item;
      });
      return index;
    },

    save: function () {
      $.post(
        '/results',
        JSON.stringify({
          result: {
            province: this.provinceChooser.province,
            votes:    this.votes
          }
        }),
        function () {},
        'json'
      );
    },

    winningParties: function () {
      var winningPartyIds = [],
          maxVotes = 0;

      _.each(this.passesByParty, function (votes, partyId) {
        if (votes > maxVotes) {
          winningPartyIds = [partyId];
          maxVotes = votes;
        }
        if (votes == maxVotes) {
          winningPartyIds.push(partyId);
        }
      });

      return _.map(winningPartyIds, function (id) {
        return this.parties[id];
      }, this);
    },

    displayResult: function () {
      var parties = this.winningParties();

      if (parties.length === 0) {
        $('#result').html(this.emptyResultTemplate({party: null})).fadeIn();
      } else {
        // Kies willekeurige winnende partij. Haha.
        var idx = Math.floor(Math.random() * parties.length);
        $('#result').html(this.resultTemplate({party: parties[idx]})).fadeIn();
      }
    },

    _onAgainButtonClick: function () {
      this.reset();
    },

    _onProvinceChoose: function () {
      this.load(this.provinceChooser.province);

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
      this.displayResult();
    }

  };

  return App;

});