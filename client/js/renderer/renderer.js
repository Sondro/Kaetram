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

            self.time = new Date();

            self.fps = 0;
            self.frameCount = 0;

            self.load();
        },

        load: function() {
            var self = this;

            self.scale = self.getScale();

            self.loadCamera();
            self.loadFont();

            self.forEachContext(function(context) {
                context.mozImageSmoothingEnabled = false;
            });

            //self.setBackground();
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

        resize: function() {
            var self = this;

            self.scale = self.getScale();

            self.camera.load();
            //self.setBackground();
        },

        render: function() {
            var self = this;

            self.clearText();

            self.draw();
            self.drawFPS();
        },

        /**
         * Context Drawing
         */

        draw: function() {
            var self = this,
                tilesetWidth = self.tileset.width / self.map.tileSize;

            self.forEachVisibleTile(function(id, index) {
                self.drawTile(self.map.isHighTile(id) ? self.foreContext : self.backContext,
                    id, self.tileset, tilesetWidth, self.map.width, index);
            });
        },

        drawTile: function(context, tileId, tileset, setWidth, gridWidth, cellId) {
            var self = this;

            if (tileId === -1)
                return;

            self.drawScaledImage(context, tileset,
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
                strokeSize = 1,
                context = self.textContext;

            if (self.scale > 2)
                strokeSize = 3;

            if (text && x && y) {
                context.save();

                if (centered)
                    context.textAlign = 'center';

                context.strokeStyle = strokeColour || '#373737';
                context.lineWidth = strokeSize;
                context.fontSize = 10 + (3 * self.scale);
                context.strokeText(text, x * self.scale, y * self.scale);
                context.fillStyle = colour || 'white';
                context.fillText(text, x * self.scale, y * self.scale);

                context.restore();
            }
        },

        drawScaledImage: function(context, image, x, y, width, height, dx, dy) {
            var self = this;

            if (!context)
                return;

            context.drawImage(image,
                x * self.scale,
                y * self.scale,
                width * self.scale,
                height * self.scale,
                dx * self.scale,
                dy * self.scale,
                width * self.scale,
                height * self.scale);
        },

        drawFPS: function() {
            var self = this,
                currentTime = new Date(),
                timeDiff = currentTime - self.time;

            if (timeDiff >= 1000) {
                self.realFPS = self.frameCount;
                self.frameCount = 0;
                self.time = currentTime;
                self.fps = self.realFPS;
            }

            self.frameCount++;

            self.drawText('FPS: ' + self.realFPS, 10, 11, false, 'white');
        },

        setBackground: function() {
            var self = this;

            self.forEachCanvas(function(canvas) {
                canvas.width = 480 * self.scale;
                canvas.height = 240 * self.scale;
            });

            self.context.fillStyle = '#12100D';
            self.context.fillRect(0, 0, 480 * self.scale, 240 * self.scale);
        },

        /**
         * Primordial Rendering functions
         */

        forEachVisibleTile: function(callback) {
            var self = this,
                y = self.camera.gridY,
                maxY = self.camera.gridY + self.camera.gridHeight,
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
            return this.game.getScaleFactor();
        },

        clearText: function() {
            this.textContext.clearRect(0, 0, 480 * this.scale, 240 * this.scale);
        },

        restore: function() {
            this.forEachContext(function(context) {
                context.restore();
            });
        },

        clearAll: function() {
            var self = this;

            self.forEachContext(function(context) {
                context.clearRect(0, 0, 480 * self.scale, 240 * self.scale);
            });
        },

        /**
         * Rendering Functions
         */

        setCameraView: function(context) {
            context.translate(-this.camera.x * this.scale, -this.camera.y * this.scale);
        },

        clearScreen: function(context) {
            var self = this;

            context.clearRect(0, 0, 480 * self.scale, 240 * self.scale);
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
        },

        setMap: function(map) {
            this.map = map;
        }

    });

});