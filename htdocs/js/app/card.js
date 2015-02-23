define(['underscore', 'jquery', 'app/widget'], function (_, $, widget) {
  return widget('card', {

    init: function () {
      this._prevParent = null;
      this._currentVote = null;

      this.on('mousedown.card', _.bind(this._onDown, this));
      this.on('touchstart.card', _.bind(this._onDown, this));
    },

    _createAnimation: function (x0, complete) {
      var self = this;

      return {
        duration: 200,
        easing: 'easeOutQuad',

        step: function (now, tween) {
          if (tween.prop != 'left') { return; }

          var opacity     = Math.max(0, Math.min(1, 1.5 - Math.abs(now - x0) / 300)),
              iconOpacity = Math.max(0, Math.min(1, Math.abs(now - x0) / 200)),
              degs        = (now - x0) / 10,
              transform   = 'rotate(' + degs + 'deg)';

          self.$element.css({
            opacity: opacity,
            transform: transform,
            '-ms-transform': transform
          });
          self.$element.find('i.vote').css('opacity', iconOpacity);
        },

        complete: _.bind(complete, this)
      };
    },

    dismiss: function (vote) {
      var offset = this.$element.offset();

      $('body').css('overflow', 'hidden');

      this.$element.removeClass('fail pass');
      this.$element.addClass(vote);

      this.$element.css({
        position: 'absolute',
        left: offset.left,
        top: offset.top,
        width: this.$element.width(),
        height: this.$element.height(),
        'will-change': 'opacity transform left top'
      }).appendTo('body');

      var animation = this._createAnimation(offset.left, function () {
        this.$element.remove();
        $('body').css('overflow', '');
      });

      this.$element.animate({
        left: vote == 'fail' ? offset.left - 300 : offset.left + 300,
        top:  offset.top + 40
      }, animation);
    },

    _onDown: function (e) {
      if (this.dragState) { return; }

      var x, y;

      if (e.type == 'touchstart') {
        if (e.originalEvent.changedTouches.length > 1) { return; }
        x = e.originalEvent.changedTouches[0].pageX;
        y = e.originalEvent.changedTouches[0].pageY;
      } else {
        x = e.pageX;
        y = e.pageY;
      }

      var offset = this.$element.offset();

      // Stop any pending animations.
      this.$element.stop();

      this.dragState = {
        active: false,

        mx0: x,
        my0: y,

        x0:  offset.left,
        y0:  offset.top,

        x:   offset.left,
        y:   offset.top,

        sx:  0,
        sy:  0
      };

      $('body').on('mousemove.card-dragging', _.bind(this._onMove, this));
      $('body').on('mouseup.card-dragging', _.bind(this._onUp, this));
      $('body').on('touchmove.card-dragging', _.bind(this._onMove, this));
      $('body').on('touchend.card-dragging', _.bind(this._onUp, this));

      e.preventDefault();

      return false;
    },

    _onMove: function (e) {
      if (!this.dragState) { return; }

      if (e.type == 'touchmove') {
        x = e.originalEvent.changedTouches[0].pageX;
        y = e.originalEvent.changedTouches[0].pageY;
      } else {
        x = e.pageX;
        y = e.pageY;
      }

      if (!this.dragState.active) {
        var significant =
          Math.abs(x - this.dragState.mx0) > 10 ||
          Math.abs(y - this.dragState.my0) > 10;

        if (significant) {
          this._prevParent = this.$element.parent();

          this.$element.css({
            position: 'absolute',
            left: this.dragState.x0,
            top: this.dragState.y0,
            width: this.$element.width(),
            height: this.$element.height(),
            'will-change': 'opacity transform left top'
          }).appendTo('body');

          this.dragState.active = true;
        }
      }

      if (this.dragState.active) {
        var dx = x - this.dragState.mx0,
            dy = y - this.dragState.my0;

        $('body').css('overflow', 'hidden');

        this.dragState.x = this.dragState.x0 + dx;
        this.dragState.y = this.dragState.y0 + dy;

        if (dx > 0 && this._currentVote != 'pass') {
          this._currentVote = 'pass';
          this.$element.removeClass('fail').addClass('pass');
        } else if (dx < 0 && this._currentVote != 'fail') {
          this._currentVote = 'fail';
          this.$element.removeClass('pass').addClass('fail');
        }

        this.$element.css({left: this.dragState.x, top: this.dragState.y});

        var opacity     = Math.max(0, Math.min(1, 1.5 - Math.abs(this.dragState.x - this.dragState.x0) / 300)),
            iconOpacity = Math.max(0, Math.min(1, Math.abs(this.dragState.x - this.dragState.x0) / 200)),
            degs        = (this.dragState.x - this.dragState.x0) / 10,
            transform   = 'rotate(' + degs + 'deg)';

        this.$element.css({
          'opacity':   opacity,
          'transform': transform,
          '-ms-transform': transform,
        });
        this.$element.find('i.vote').css('opacity', iconOpacity);
      }
    },

    _onUp: function () {
      if (!this.dragState || !this.dragState.active) {
        this.dragState = null;
        return;
      }

      if (this.dragState.x - this.dragState.x0 < -100) {
        this.commit('fail');
      } else if (this.dragState.x - this.dragState.x0 > 100) {
        this.commit('pass');
      } else {
        this.revert();
      }

      this.dragState = null;
      $('body').off('.card-dragging');
    },

    commit: function (evt) {
      window.app.vote(this.$element.data('candidate'), evt);
      window.app.stack.nextCard();

      var animation = this._createAnimation(this.dragState.x0, function () {
        this.$element.remove();
        $('body').css('overflow', '');
      });

      this.$element.animate({
        left: this.dragState.x0 + (this.dragState.x - this.dragState.x0) * 2,
        top:  this.dragState.y0 + (this.dragState.y - this.dragState.y0) * 2
      }, animation);
    },

    placeBack: function () {
      this.$element.appendTo(this._prevParent);
    },

    revert: function () {
      var animation = this._createAnimation(this.dragState.x0, function () {
        this.$element.css({
          position: '',
          left: '', top: '',
          width: '', height: '',
          'will-change': ''
        });

        this.placeBack();
        this.$element.removeClass('pass fail');
        $('body').css('overflow', '');
      });

      this.$element.animate({
        left: this.dragState.x0,
        top:  this.dragState.y0
      }, animation);
    }

  });
});