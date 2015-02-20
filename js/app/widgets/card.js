define(['underscore', 'app/widget'], function (_, widget) {
  return widget('card', {

    init: function () {
      this._prevParent = null;
      this._prevSibling = null;

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

          var degs = (now - x0) / 10;
          var transform = 'rotate(' + degs + 'deg)';

          self.$element.css({
            transform: transform,
            '-ms-transform': transform
          });
        },

        complete: _.bind(complete, this)
      };
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
          if (this.$element.index() === 0) {
            this._prevParent = this.$element.parent();
          } else {
            this._prevSibling = this.$element.prev();
          }

          this.$element.css({
            position: 'absolute',
            left: this.dragState.x0,
            top: this.dragState.y0
          }).appendTo('body');

          this.dragState.active = true;
        }
      }

      if (this.dragState.active) {
        this.dragState.x = this.dragState.x0 + x - this.dragState.mx0;
        this.dragState.y = this.dragState.y0 + y - this.dragState.my0;

        this.$element.css({left: this.dragState.x, top: this.dragState.y});

        var degs = (this.dragState.x - this.dragState.x0) / 10;

        var transform = 'rotate(' + degs + 'deg)';

        this.$element.css({
          'transform': transform,
          '-ms-transform': transform,
        });
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
      var animation = this._createAnimation(this.dragState.x0, function () {
        this.placeBack();
        this.$element.trigger(evt);
        this.$element.remove();
      });


      this.$element.animate({
        left: this.dragState.x0 + (this.dragState.x - this.dragState.x0) * 2,
        top:  this.dragState.y0 + (this.dragState.y - this.dragState.y0) * 2
      }, animation);
    },

    placeBack: function () {
      if (this._prevParent) {
        this.$element.prependTo(this._prevParent);
      } else {
        this.$element.insertAfter(this._prevSibling);
      }
    },

    revert: function () {
      var animation = this._createAnimation(this.dragState.x0, function () {
        this.$element.css({
          position: '', left: '', top: ''
        });

        this.placeBack();
      });

      this.$element.animate({
        left: this.dragState.x0,
        top:  this.dragState.y0
      }, animation);
    }

  });
});