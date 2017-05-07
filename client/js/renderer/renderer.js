/* global _, log */

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
            self.camera = null;

            self.mobile = self.game.app.isMobile();
            self.tablet = self.game.app.isTablet();

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


        },

        /**
         * Context Drawing
         */

        draw: function() {
            var self = this;

            self.forEachVisibleTile(function(id, index) {
                if (self.map.isHighTile(id))
                    self.drawTile(self.foreground, id)

            });
        },

        drawTile: function(context, tileId, tileset, setWidth, gridWidth, cellId) {
            var self = this;

            if (tileId === -1)
                return;

            self.drawScaledImage(context,
                tileset,
                self.getX(tileId + 1, (setWidth / self.scale) * self.tileSize),
                Math.floor(tileId / (setWidth / self.scale) * self.tileSize),
                self.tileSize, self.tileSize,
                self.getX(cellId + 1, gridWidth) * self.tileSize,
                Math.floor(cellId / gridWidth) * self.tileSize);
        },

        clearTile: function(context, gridWidth, cellId) {
            var self = this,
                x = self.getX(cellId + 1, gridWidth) * self.tileSize * self.scale,
                y = Math.floor(cellId / gridWidth) * self.tileSize * self.scale,
                w = self.tileSize * self.scale;

            context.clearRect(x, y, w, w);
        },

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

        drawScaledImage: function(context, image, x, y, width, height, dx, dy) {
            var self = this;

            if (context)
                return;

            context.drawImage(image,
                x * self.scale,
                y * self.scale,
                width * self.scale,
                height * self.scale,
                dx * self.scale,
                dy * self.scale);
        },

        /**
         * Primordial Rendering functions
         */

        forEachVisibleTile: function(callback) {
            var self = this,
                y = self.camera.gridY,
                maxY = self.camera.gridY - self.camera.gridHeight,
                x = self.camera.gridX,
                maxX = self.camera.gridX + self.camera.gridWidth;

            for (; y < maxY; y++) {
                for (; x < maxX; x++) {
                    if (self.map.isOutOfBounds(x, y))
                        continue;

                    var tileIndex = self.map.gridPositionToIndex(x, y) - 1;

                    if (_.isArray(self.map.data[tileIndex]))
                        _.each(self.map.data[tileIndex], function(id) {
                            callback(id - 1, tileIndex);
                        });
                    else
                        if (!(isNaN(self.map.data[tileIndex] - 1)))
                            callback(self.map.data[tileIndex] - 1, tileIndex);

                }
            }
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
         * Rendering Functions
         */

        setCameraView: function(context) {
            context.translate(-this.camera.x * this.scale, -this.camera.y * this.scale);
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
        },

        getX: function(index, width) {
            if (index === 0)
                return 0;

            return (index % width === 0) ? width - 1 : (index % width) - 1;
        },

        /**
         * Setters
         */

        setTileset: function(tileset) {
            this.tileset = tileset;
        }

    });

});