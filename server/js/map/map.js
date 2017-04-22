var cls = require('../lib/class'),
    map = require('../../data/map/world_server.json'),
    Utils = require('../util/utils'),
    fs = require('fs'),
    _ = require('underscore'),
    config = require('../../config.json');

module.exports = Map = cls.Class.extend({

    init: function(world) {
        var self = this;

        self.world = world;
        self.ready = false;

        self.load();
    },

    load: function() {
        var self = this;

        self.width = map.width;
        self.height = map.height;
        self.collisions = map.collisions;
        self.bossAreas = map.bossAreas;
        self.roamingAreas = map.roamingAreas;
        self.chestAreas = map.chestAreas;
        self.staticChests = map.staticChests;
        self.staticEntities = map.staticEntities;

        self.zoneWidth = 30;
        self.zoneHeight = 15;

        self.groupWidth = Math.floor(self.width / self.zoneWidth);
        self.groupHeight = Math.floor(self.height / self.zoneHeight);

        self.areas = {};

        self.pvpAreas = [];
        self.pvpGameAreas = [];
        self.healingAreas = [];
        self.waitingAreas = [];

        self.loadAreas();
        self.loadCollisions();

        self.ready = true;
    },

    loadAreas: function() {
        var self = this;


    },

    loadCollisions: function() {
        var self = this,
            location = './server/data/map/collisions.json';

        self.grid = null;

        fs.exists(location, function(exists) {
            if (!exists || config.forceCollisions) {

                log.info('Generating the collision grid...');

                self.grid = [];

                var tileIndex = 0;

                for (var i = 0; i < self.height; i++) {
                    self.grid[i] = [];
                    for (var j = 0; j < self.width; j++) {
                        if (_.include(self.collisions, tileIndex))
                            self.grid[i][j] = 1;
                        else
                            self.grid[i][j] = 0;

                        tileIndex += 1;
                    }
                }

                fs.writeFile(location, JSON.stringify(self.grid), function(err) {
                    if (err) {
                        log.info('An error has occurred: ' + err);
                        return;
                    }

                    log.info('The collision grid has been successfully generated!');

                    self.done();
                });

            } else {
                self.grid = require('../../data/map/collisions.json');

                log.info('[Map] Successfully loaded the collision grid!');

                self.done();
            }
        });
    },

    isValidPosition: function(x, y) {

    },

    getRandomPosition: function(area) {
        var self = this,
            pos = {},
            valid = false;

        while (!valid) {
            pos.x = area.x + Utils.randomInt(0, area.width + 1);
            pos.y = area.y + Utils.randomInt(0, area.height + 1);
            valid = self.isValidPosition(pos.x, pos.y);
        }

        return pos;
    },

    done: function() {
        if (this.readyCallback)
            this.readyCallback();
    },

    isReady: function(callback) {
        this.readyCallback = callback;
    }


});