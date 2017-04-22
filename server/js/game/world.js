var cls = require('../lib/class'),
    config = require('../../config.json'),
    Player = require('./entity/character/player/player'),
    Map = require('../map/map'),
    async = require('async');

module.exports = World = cls.Class.extend({

    init: function(id, socket, database) {
        var self = this;

        self.id = id;
        self.socket = socket;
        self.database = database;

        self.playerCount = 0;
        self.maxPlayers = config.maxPlayers;
        self.updateTime = config.updateTime;

        self.players = {};
        self.entities = {};
        self.mobs = {};
        self.npcs = {};

        self.packets = {};
        self.groups = {};

        self.ready = false;

        self.onPlayerConnection(function(connection) {
            var player = new Player(self, self.database, connection);

            self.players[player.id] = player;
        });

        self.load();
    },

    load: function() {
        var self = this;


        self.map = new Map(self);
        self.map.isReady(function() {
            log.info('The map has finished loading.');
        });
        /**
         * Similar to TTA engine here, but it's loaded upon initialization
         * rather than being called from elsewhere.
         */

        self.tick();

        self.ready = true;
    },

    tick: function() {
        var self = this;

        setInterval(function() {

            self.parsePackets();
            self.parseGroups();

        }, 1000 / self.updateTime);
    },

    parsePackets: function() {
        var self = this, connection;

        /**
         * This parses through all the packet pool and sends them
         * whenever the server has time
         */

        for (var id in self.packets) {
            if (self.packets.hasOwnProperty(id) && self.packets[id].length > 0) {
                var conn = self.socket.getConnection(id);

                if (conn) {
                    connection = conn;

                    connection.send(self.packets[id]);
                    self.packets[id] = [];
                } else
                    delete self.socket.getConnection(id);
            }
        }

    },

    parseGroups: function() {

    },

    onPopulationUpdate: function(callback) {
        this.populationCallback = callback;
    },

    onPlayerConnection: function(callback) {
        this.playerConnectCallback = callback;
    }

});