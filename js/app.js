define(['app/stack'], function (Stack) {

  var App = function () {
    this.stack = new Stack('#stack', {province: 'Flevoland'});
  };

  App.prototype = {


  };

  return App;

});