/* global log */

define(function() {

    return Class.extend({

        init: function(game) {
            var self = this;

            self.game = game;
            self.camera = game.getCamera();
            self.renderer = game.renderer;
        },

        update: function() {
            this.animateTiles();
        },

        animateTiles: function() {
            var self = this,
                time = self.game.time;

            self.renderer.forEachAnimatedTile(function(tile) {
                if (tile.animate(time)) {
                    tile.isDirty = true;
                    tile.dirtyRect = self.renderer.getTileBounds(tile);

                }
            });
        }

    });

});