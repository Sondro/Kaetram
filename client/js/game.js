/* global Class, log*/

define(['./renderer/renderer', './utils/storage', './map/map'], function(Renderer, LocalStorage, Map) {

    return Class.extend({

        init: function(app) {
            var self = this;

            self.app = app;

            self.renderer = null;
            self.storage = null;
            self.map = null;

            self.loadRenderer();
            self.loadControllers();
            self.loadMisc();
        },

        loadRenderer: function() {
            var self = this,
                background = document.getElementById('background'),
                foreground = document.getElementById('foreground'),
                textCanvas = document.getElementById('textCanvas'),
                entities = document.getElementById('entities'),
                chatInput = document.getElementById('chatInput');

            self.setRenderer(new Renderer(background, entities, foreground, textCanvas, self));
        },

        loadControllers: function() {
            var self = this;

            self.setStorage(new LocalStorage());

        },

        loadMisc: function() {
            var self = this;

            if (self.app.hasWorker())
                self.loadMap();
        },

        loadMap: function() {
            var self = this;

            self.map = new Map(self);

            self.map.onReady(function() {
                log.info('The map has been loaded!');
            });
        },

        getStorage: function() {
            return this.storage;
        },

        setRenderer: function(renderer) {
            this.renderer = renderer;
        },

        setStorage: function(storage) {
            this.storage = storage;
        }

    });

});