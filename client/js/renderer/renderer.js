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

            self.screenWidth = 0;
            self.screenHeight = 0;

            self.time = new Date();

            self.fps = 0;
            self.frameCount = 0;

            self.load();
        },

        load: function() {
            var self = this;

            self.scale = self.getScale();
            self.drawingScale = self.getDrawingScale();

            self.forEachContext(function(context) {
                context.mozImageSmoothingEnabled = false;
            });

            self.loadCamera();
            self.loadFont();
        },

        loadCamera: function() {
            var self = this;

            if (!self.camera)
                self.camera = new Camera(self);

            self.screenWidth = self.camera.gridWidth * self.tileSize;
            self.screenHeight = self.camera.gridHeight * self.tileSize;

            var width = self.screenWidth * self.drawingScale,
                height = self.screenHeight * self.drawingScale;

            self.forEachCanvas(function(canvas) {
                canvas.width = width;
                canvas.height = height;
            });

            self.camera.load();
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

            self.loadCamera();
        },

        render: function() {
            var self = this;

            self.saveAll();
            self.clearAll();

            self.draw();
            self.drawFPS();

            self.restoreAll();
        },

        /**
         * Context Drawing
         */

        draw: function() {
            var self = this,
                tilesetWidth = self.tileset.width / self.map.tileSize;

            self.updateView();

            self.forEachVisibleTile(function(id, index) {
                var isHighTile = self.map.isHighTile(id);

                self.drawTile(isHighTile ? self.foreContext : self.backContext,
                    id, self.tileset, tilesetWidth, self.map.width, index);
            });
        },

        drawTile: function(context, tileId, tileset, setWidth, gridWidth, cellId) {
            var self = this;

            if (tileId === -1)
                return;

            self.drawScaledImage(context, tileset,
                self.getX(tileId + 1, (setWidth / self.drawingScale)) * self.tileSize,
                Math.floor(tileId / (setWidth / self.drawingScale)) * self.tileSize,
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
                x * self.drawingScale,
                y * self.drawingScale,
                width * self.drawingScale,
                height * self.drawingScale,
                dx * self.drawingScale,
                dy * self.drawingScale,
                width * self.drawingScale,
                height * self.drawingScale);
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

        /**
         * Primordial Rendering functions
         */

        forEachVisibleIndex: function(callback) {
            var self = this;

            self.camera.forEachVisiblePosition(function(x, y) {
                if (!self.map.isOutOfBounds(x, y))
                    callback(self.map.gridPositionToIndex(x, y) - 1);
            });
        },

        forEachVisibleTile: function(callback) {
            var self = this;

            if (!self.map.mapLoaded)
                return;

            self.forEachVisibleIndex(function(index) {
                if (_.isArray(self.map.data[index]))
                    _.each(self.map.data[index], function(id) { callback(id - 1, index); });
                else if (!(isNaN(self.map.data[index] - 1)))
                    callback(self.map.data[index] - 1, index);
            });
        },

        isVisiblePosition: function(x, y) {
            return y >= this.camera.gridY && y < this.camera.gridY + this.camera.gridHeight &&
                    x >= this.camera.gridX && x < this.camera.gridX + this.camera.gridWidth
        },

        getScale: function() {
            return this.game.getScaleFactor();
        },

        getDrawingScale: function() {
            var self = this,
                scale = self.getScale();

            if (self.mobile)
                scale = 2;

            return scale;
        },
        
        clearText: function() {
            this.textContext.clearRect(0, 0, this.screenWidth * this.scale, this.screenHeight * this.scale);
        },

        restore: function() {
            this.forEachContext(function(context) {
                context.restore();
            });
        },

        clearAll: function() {
            var self = this;

            self.forEachContext(function(context) {
                context.clearRect(0, 0, self.screenWidth * self.scale, self.screenHeight * self.scale);
            });
        },

        saveAll: function() {
            var self = this;

            self.forEachContext(function(context) {
                context.save();
            });
        },

        restoreAll: function() {
            var self = this;

            self.forEachContext(function(context) {
                context.restore();
            });
        },

        /**
         * Rendering Functions
         */

        updateView: function() {
            var self = this;

            self.forEachContext(function(context) {
                self.setCameraView(context);
            });
        },

        setCameraView: function(context) {
            context.translate(-this.camera.x * this.scale, -this.camera.y * this.scale);
        },

        clearScreen: function(context) {
            var self = this;

            context.clearRect(0, 0, this.screenWidth * self.scale, this.screenHeight * self.scale);
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