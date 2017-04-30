/* global module */

var cls = require('../lib/class'),
    config = require('../../config.json'),
    Player = require('./entity/character/player/player'),
    Map = require('../map/map'),
    _ = require('underscore'),
    Messages = require('../network/messages');

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

        self.loadedGroups = false;

        self.ready = false;

        self.onPlayerConnection(function(connection) {
            var player = new Player(self, self.database, connection);

            self.players[player.id] = player;

            connection.sendUTF8('ready');
        });
    },

    load: function() {
        var self = this;

        log.info('************ World ' + self.id + ' ***********');

        self.map = new Map(self);
        self.map.isReady(function() {
            self.loadGroups();

        });
        /**
         * Similar to TTA engine here, but it's loaded upon initialization
         * rather than being called from elsewhere.
         */

        self.tick();

        self.ready = true;

        log.info('********************************');
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
        var self = this;

        if (!self.loadedGroups)
            return;

        self.map.groups.forEachGroup(function(groupId) {
            var spawns = [];

            if (self.groups[groupId].incoming.length < 1)
                return;

            spawns = self.getSpawns(groupId);

            self.groups[groupId].incoming = [];
        });
    },

    getSpawns: function(groupId) {
        var self = this;

        if (!groupId)
            return;

        return _.each(self.groups[groupId].incoming, function(entity) {
            if (entity.kind === null)
                return;

            self.pushToGroup(groupId, new Messages.Spawn(entity), entity instanceof Player ? entity.id : null);
        });
    },

    loadGroups: function() {
        var self = this;

        self.map.groups.forEachGroup(function(groupId) {
            self.groups[groupId] = {
                entities: {},
                players: [],
                incoming: []
            };

        });

        self.loadedGroups = true;
    },

    getEntityById: function(id) {
        if (id in this.entities)
            return this.entities[id];
    },

    /**
     * Important functions for sending
     * messages to the player(s)
     */

    pushBroadcast: function(message) {
        var self = this;

        _.each(self.packets, function(packet) {
            packet.push(message.serialize());
        });
    },

    pushToPlayer: function(player, message) {
        if (player && player.id in this.packets)
            this.packets[player.id].push(message.serialize());
    },

    pushToGroup: function(id, message, ignore) {
        var self = this,
            group = self.groups[id];

        if (!group)
            return;

        _.each(group.players, function(playerId) {
            if (playerId !== ignore)
                self.pushToPlayer(self.getEntityById(playerId), message);
        });
    },

    pushToAdjacentGroups: function(groupId, message) {
        var self = this;

        self.map.groups.forEachAdjacentGroup(groupId, function(id) {
            self.pushToGroup(id, message);
        });
    },

    pushToOldGroups: function(player, message) {
        var self = this;

        _.each(player.recentGroups, function(id) {
            self.pushToGroup(id, message);
        });

        player.recentGroups = [];
    },

    onPopulationUpdate: function(callback) {
        this.populationCallback = callback;
    },

    onPlayerConnection: function(callback) {
        this.playerConnectCallback = callback;
    }

});