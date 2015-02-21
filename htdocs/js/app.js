define(['handlebars', 'app/stack', 'app/province-chooser', 'text!templates/result.html', 'text!templates/invalid-result.html', 'text!templates/small-party-result.html'], function (H, Stack, ProvinceChooser, ResultTemplate, InvalidResultTemplate, SmallPartyResultTemplate) {

  var App = function () {
    this.passes = 0;
    this.votes = {};
    this.parties = {};
    this.smallParties = [];
    this.passesByParty = {};
    this.resultTemplate = H.compile(ResultTemplate);
    this.invalidResultTemplate = H.compile(InvalidResultTemplate);
    this.smallPartyResultTemplate = H.compile(SmallPartyResultTemplate);

    $('#buttons').on('click touchstart', '[data-vote]', _.bind(this._onVoteButtonClick, this));
    $('#result').on('click', '[data-action="again"]', _.bind(this._onAgainButtonClick, this));

    $('#result').hide();

    this.provinceChooser = new ProvinceChooser('#province-chooser');
    this.provinceChooser.on('choose', _.bind(this._onProvinceChoose, this));

    this.stack = new Stack('#stack');
    this.stack.on('fail pass', '.card', _.bind(this._onFailPass, this));
    this.stack.on('stackend', _.bind(this._onStackEnd, this));
  };

  App.prototype = {

    reset: function () {
      this.passes = 0;
      this.votes = {};
      this.parties = {};
      this.smallParties = [];
      this.passesByParty = {};
      this.provinceChooser.reset();

      this.provinceChooser.$element.fadeIn(function () {
        $(this).css('display', '');
        $('#result').hide();
      });
    },

    vote: function (vote) {
      var candidate = this.stack.find('.card:last-child').data('candidate');
      this.votes[candidate.id] = vote;

      if (vote == 'pass') {
        this.passes++;

        var partyId = candidate.party_id;
        if (this.parties[partyId].small) {
          partyId = 'small';
        }

        if (!this.passesByParty[partyId]) {
          this.passesByParty[partyId] = 0;
        }
        this.passesByParty[partyId]++;
      }
    },

    load: function (province) {
      var self = this;

      return $.getJSON('/candidates?province=' + province).then(function (data) {
        self.processData(data);
      });
    },

    processData: function (data) {
      this.parties = this.indexById(data.parties);

      if (this.provinceChooser.province == 'Flevoland' || this.provinceChooser.province == 'Gelderland') {
        this.keepCandidates(data.candidates, 3);
      } else {
        this.keepCandidates(data.candidates, 5);
      }
      this.stack.setCandidates(this.candidates);
    },

    keepCandidates: function (candidates, max) {
      this.candidates   = [];
      this.smallParties = [];

      var partyCount = this.countCandidatesByParty(candidates);

      // Mark small parties.
      _.each(partyCount, function (count, partyId) {
        if (count < max) {
          this.parties[partyId].small = true;
          this.smallParties.push(this.parties[partyId]);
        } else {
          this.parties[partyId].small = false;
        }
      }, this);

      // Now, keep only a maximum number of candidates per party.
      partyCount = {};
      _.each(candidates, function (candidate) {
        var partyId = candidate.party_id;
        if (this.parties[partyId].small) {
          partyId = 'small';
        }

        if (!partyCount[partyId]) {
          partyCount[partyId] = 0;
        }

        if (partyCount[partyId] < max) {
          this.candidates.push(candidate);
          partyCount[partyId]++;
        }
      }, this);
    },

    countCandidatesByParty: function (candidates) {
      var partyCount = {};
      _.each(candidates, function (candidate) {
        if (!partyCount[candidate.party_id]) {
          partyCount[candidate.party_id] = 0;
        }
        partyCount[candidate.party_id]++;
      });

      return partyCount;
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
        } else if (votes == maxVotes) {
          winningPartyIds.push(partyId);
        }
      });

      return _.map(winningPartyIds, function (id) {
        if (id == 'small') {
          return 'small';
        } else {
          return this.parties[id];
        }
      }, this);
    },

    displayResult: function () {
      if (this.passes === 0 || this.passes == this.candidates.length) {
        $('#result').html(this.invalidResultTemplate({party: null})).fadeIn(function () {
          $(this).css('display', '');
        });
      } else {
        var parties = this.winningParties();
        parties = ['small'];

        // Kies willekeurige winnende partij. Haha.
        var idx = Math.floor(Math.random() * parties.length);
        if (parties[idx] == 'small') {
          $('#result').html(this.smallPartyResultTemplate({parties: this.smallParties})).fadeIn(function () {
            $(this).css('display', '');
          });
        } else {
          $('#result').html(this.resultTemplate({party: parties[idx]})).fadeIn(function () {
            $(this).css('display', '');
          });
        }
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

      return false;
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