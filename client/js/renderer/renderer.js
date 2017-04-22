define(function() {

    return Class.extend({

        init: function(background, entities, foreground, textCanvas, game) {
            var self = this;

            self.background = background;
            self.entities = entities;
            self.foreground = foreground;
            self.textCanvas = textCanvas;

            self.context = entities.getContext('2d');
            self.backContext = background.getContext('2d');
            self.foreContext = foreground.getContext('2d');
            self.textContext = textCanvas.getContext('2d');

            self.game = game;
            self.app = self.game.app;

            self.mobile = self.app.isMobile();
            self.tablet = self.app.isTablet();

            self.load();
        },

        load: function() {
            var self = this;


        }

    });

});