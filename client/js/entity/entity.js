define(function() {

    return Class.extend({

        init: function(id, kind) {
            var self = this;

            self.id = id;
            self.kind = kind;

            self.x = 0;
            self.y = 0;
            self.gridX = 0;
            self.gridY = 0;

            self.name = '';

            self.sprite = null;
            self.spriteFlipX = false;
            self.spriteFlipY = false;

            self.animations = null;
            self.currentAnimation = null;

            self.shadowOffsetY = 0;

            self.spriteLoaded = false;
        },

        setPosition: function(x, y) {
            this.x = x;
            this.y = y;
        },

        setGridPosition: function(x, y) {
            var self = this;

            self.gridX = x;
            self.gridY = y;

            self.setPosition(x * 16, y * 16);
        },

        setAnimation: function(name, speed, count, onEndCount) {
            var self = this;

            if (!self.spriteLoaded || (self.currentAnimation && self.currentAnimation.name === name))
                return;

            var anim = self.getAnimationByName(name);

            if (!anim)
                return;

            if (name.substr(0, 3) === 'atk')
                self.currentAnimation.reset();

            self.currentAnimation.setSpeed(speed);

            self.currentAnimation.setCount(count ? count : 0, onEndCount || function() {
                self.idle();
            });
        },

        getAnimationByName: function(name) {
            if (name in this.animations)
                return this.animations[name];

            return null;
        }

    });

});