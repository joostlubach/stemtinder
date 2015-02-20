define(['app/stack'], function (Stack) {

  var App = function () {
    this.votes = {};
    this.province = 'Flevoland';

    this.stack = new Stack('#stack', {province: this.province});
    this.stack.on('fail pass', '.card', _.bind(this._onFailPass, this));
    this.stack.on('stackend', _.bind(this._onStackEnd, this));
  };

  App.prototype = {

    _onFailPass: function (e) {
      var candidate = $(e.currentTarget).data('candidate');
      this.votes[candidate.id] = e.type;
    },

    _onStackEnd: function (e) {
      // Post the result.

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
    }

  };

  return App;

});