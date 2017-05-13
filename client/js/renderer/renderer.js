/* global _, log */

define(['./camera', './tile'], function(Camera, Tile) {

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

            self.contexts = [self.backContext, self.foreContext];
            self.canvases = [self.background, self.entities, self.foreground, self.textCanvas];

            self.game = game;
            self.camera = null;

            self.checkDevice();

            self.scale = 1;
            self.tileSize = 16;
            self.fontSize = 10;

            self.screenWidth = 0;
            self.screenHeight = 0;

            self.time = new Date();

            self.fps = 0;
            self.frameCount = 0;
            self.renderedFrame = [0, 0];

            self.animatedTiles = [];

            self.load();
        },

        load: function() {
            var self = this;

            self.scale = self.getScale();
            self.drawingScale = self.getDrawingScale();

            self.forEachContext(function(context) {
                context.mozImageSmoothingEnabled = false;
            });

            self.loadFont();
        },

        loadSizes: function() {
            var self = this;

            if (!self.camera)
                return;

            self.screenWidth = self.camera.gridWidth * self.tileSize;
            self.screenHeight = self.camera.gridHeight * self.tileSize;

            var width = self.screenWidth * self.drawingScale,
                height = self.screenHeight * self.drawingScale;

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

        loadCamera: function() {
            var self = this;

            self.camera = new Camera(this);

            self.loadSizes();

            self.camera.onGridChange(function() {
                self.updateAnimatedTiles();
            });

            self.updateAnimatedTiles();
        },

        resize: function() {
            var self = this;

            self.scale = self.getScale();
            self.drawingScale = self.getDrawingScale();

            self.checkDevice();

            self.loadSizes();

            if (self.camera)
                self.camera.update();

            self.loadFont();

            setTimeout(function() {
                self.renderedFrame[0] = -1;
            }, 400);
        },

        render: function() {
            var self = this;

            self.clearScreen(self.context);
            self.context.save();

            self.saveAll();

            /**
             * Rendering related draws
             */

            self.draw();
            self.drawAnimatedTiles();

            /**
             * Text related draws
             */
            self.drawFPS();

            self.restoreAll();
            self.context.restore();
        },

        /**
         * Context Drawing
         */

        draw: function() {
            var self = this;

            if (self.hasRenderedFrame())
                return;

            self.clearAll();
            self.updateView();

            self.forEachVisibleTile(function(id, index) {
                var isHighTile = self.map.isHighTile(id),
                    context = isHighTile ? self.foreContext : self.backContext;

                if (!self.map.isAnimatedTile(id))
                    self.drawTile(context, id, self.tileset, self.tileset.width / self.tileSize, self.map.width, index);

            });

            self.saveFrame();
        },

        drawAnimatedTiles: function() {
            var self = this;

            self.setCameraView(self.context);

            self.forEachAnimatedTile(function(tile) {
                self.drawTile(self.context, tile.id, self.tileset, self.tileset.width / self.tileSize, self.map.width, tile.index);
                tile.loaded = true;
            });
        },

        redrawTile: function(tile) {
            var self = this;

            self.clearTile(self.context, self.map.width, tile.index);
            self.drawTile(self.context, tile.id, self.tileset, self.tileset.width / self.tileSize, self.map.width, tile.index);
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
         * Primitive drawing functions
         */

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
                x = self.getX(cellId + 1, gridWidth) * self.tileSize * self.drawingScale,
                y = Math.floor(cellId / gridWidth) * self.tileSize * self.drawingScale,
                w = self.tileSize * self.scale;

            context.clearRect(x, y, w, w);
        },

        drawText: function(text, x, y, centered, colour, strokeColour) {
            var self = this,
                strokeSize = 1,
                context = self.textContext;

            self.clearText();

            if (self.scale > 2)
                strokeSize = 3;

            if (text && x && y) {
                if (centered)
                    context.textAlign = 'center';

                context.strokeStyle = strokeColour || '#373737';
                context.lineWidth = strokeSize;
                context.fontSize = 10 + (3 * self.scale);
                context.strokeText(text, x * self.scale, y * self.scale);
                context.fillStyle = colour || 'white';
                context.fillText(text, x * self.scale, y * self.scale);
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

        forEachAnimatedTile: function(callback) {
            _.each(this.animatedTiles, function(tile) {
                callback(tile);
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

        clearContext: function() {
            this.context.clearRect(0, 0, this.screenWidth * this.scale, this.screenHeight * this.scale);
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
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
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
            context.translate(-this.camera.x * this.drawingScale, -this.camera.y * this.drawingScale);
        },

        clearScreen: function(context) {
            context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        },

        hasRenderedFrame: function() {
            return this.renderedFrame[0] === this.camera.x && this.renderedFrame[1] === this.camera.y;
        },

        saveFrame: function() {
            var self = this;

            if (!self.hasRenderedFrame()) {
                self.renderedFrame[0] = self.camera.x;
                self.renderedFrame[1] = self.camera.y;
            }
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

        checkDevice: function() {
            var self = this;

            self.mobile = self.game.app.isMobile();
            self.tablet = self.game.app.isTablet();
        },

        /**
         * Setters
         */

        setTileset: function(tileset) {
            this.tileset = tileset;
        },

        setMap: function(map) {
            this.map = map;
        },

        updateAnimatedTiles: function() {
            var self = this,
                newTiles = [];

            self.forEachVisibleTile(function(id, index) {
                /**
                 * We don't want to reinitialize animated tiles that already exist
                 * and are within the visible camera proportions. This way we can parse
                 * it every time the tile moves slightly.
                 */

                if (!self.map.isAnimatedTile(id))
                    return;

                /**
                 * Push the pre-existing tiles.
                 */

                var tileIndex = self.animatedTiles.indexOf(id);

                if (tileIndex > -1) {
                    newTiles.push(self.animatedTiles[tileIndex]);
                    return;
                }

                var tile = new Tile(id, index, self.map.getTileAnimationLength(id), self.map.getTileAnimationDelay(id)),
                    position = self.map.indexToGridPosition(tile.index);

                tile.setPosition(position);

                newTiles.push(tile);
            });

            self.animatedTiles = newTiles;
        },

        /**
         * Getters
         */

        getZoom: function() {
            return this.game.app.zoomFactor;
        },

        getTileBounds: function(tile) {
            var self = this,
                bounds = {},
                cellId = tile.index;

            bounds.x = (self.getX(cellId + 1, self.map.width) * self.tileSize - self.camera.x) * self.drawingScale;
            bounds.y = ((Math.floor(cellId / self.map.width) * self.tileSize) - self.camera.y) * self.drawingScale;
            bounds.width = self.tileSize * self.drawingScale;
            bounds.height = self.tileSize * self.drawingScale;
            bounds.left = bounds.x;
            bounds.right = bounds.x + bounds.width;
            bounds.top = bounds.y;
            bounds.bottom = bounds.y + bounds.height;

            return bounds;
        }

    });

});