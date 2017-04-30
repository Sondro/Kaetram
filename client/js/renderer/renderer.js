define(['./camera'], function(Camera) {

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

            self.contexts = [self.context, self.backContext, self.foreContext, self.textContext];
            self.canvases = [self.background, self.entities, self.foreground, self.textCanvas];

            self.game = game;
            self.app = self.game.app;
            self.camera = null;

            self.mobile = self.app.isMobile();
            self.tablet = self.app.isTablet();

            self.scale = 1;
            self.tileSize = 16;
            self.fontSize = 10;

            self.load();
        },

        load: function() {
            var self = this;

            self.scale = self.game.getScaleFactor();

            self.loadCamera();
            self.loadFont();

            self.forEachContext(function(context) {
                context.mozImageSmoothingEnabled = false;
            });
        },

        loadCamera: function() {
            var self = this;

            self.camera = new Camera(self);

            var width = self.camera.gridWidth * self.tileSize * self.scale,
                height = self.camera.gridHeight * self.tileSize * self.scale;

            self.forEachCanvas(function(canvas) {
                canvas.width = width;
                canvas.height = height;
            });
        },

        loadFont: function() {
            var self = this;

            if (self.getScale() > 2)
                self.fontSize = 20;

            self.textContext.font = self.fontSize + 'px AdvoCut';
        },

        render: function() {
            var self = this;

            self.drawText('You are dumb.', 0, 0);
        },

        /**
         * Context Drawing
         */

        drawText: function(text, x, y, centered, colour, strokeColour) {
            var self = this,
                strokeSize = 3,
                context = self.textContext;

            if (self.scale > 2)
                strokeSize = 5;

            if (text && x && y) {
                context.save();

                if (centered)
                    context.textAlign = 'center';

                context.strokeStyle = strokeColour || '#373737';
                context.lineWidth = strokeSize;
                context.strokeText(text, x, y);
                context.fillStyle = color || 'white';
                context.fillText(text, x, y);

                context.restore();
            }
        },

        /**
         * Primordial Rendering functions
         */

        forEachTile: function(callback) {
            var self = this,
                y = self.camera.gridY,
                maxY = self.camera.gridY - self.camera.gridHeight,
                x = self.camera.gridX,
                maxX = self.camera.gridX + self.camera.gridWidth;

            for (; y < maxY; y++)
                for (; x < maxX; x++)
                    callback(x, y);
        },

        isVisiblePosition: function(x, y) {
            return y >= this.camera.gridY && y < this.camera.gridY + this.camera.gridHeight &&
                    x >= this.camera.gridX && x < this.camera.gridX + this.camera.gridWidth
        },

        getScale: function() {
            return this.scale;
        },

        clean: function() {

        },

        /**
         * Miscellaneous functions
         */

        forEachContext: function(callback) {
            var self = this;

            for (var index in self.contexts)
                if (self.contexts.hasOwnProperty(index))
                    callback(self.contexts[index]);
        },

        forEachCanvas: function(callback) {
            var self = this;

            for (var index in self.canvases)
                if (self.canvases.hasOwnProperty(index))
                    callback(self.canvases[index]);
        }

    });

});