/* global module */

var Character = require('../character'),
    Incoming = require('../../../../controllers/incoming'),
    Armour = require('./equipment/armour'),
    Weapon = require('./equipment/weapon'),
    Pendant = require('./equipment/pendant'),
    Ring = require('./equipment/ring'),
    Boots = require('./equipment/boots'),
    Items = require('../../../../util/items');

module.exports = Player = Character.extend({

    init: function(world, database, connection) {
        var self = this;

        self.world = world;
        self.mysql = database;
        self.connection = connection;

        self.id = self.connection.id;
        self.clientId = -1;

        self.incoming = new Incoming(self);

        self.isNew = false;
    },

    load: function(data) {
        var self = this;

        self.username = data.username;

        self.isNew = false;
    },

    intro: function() {
        var self = this;

        /**
         * Send player data to client here
         */

    },

    setArmour: function(id, count, skill, skillLevel) {
        var self = this;

        if (!id)
            return;

        self.armour = new Armour(Items.idToString(id), id, count, skill, skillLevel);
    },

    setWeapon: function(id, count, skill, skillLevel) {
        var self = this;

        if (!id)
            return;

        self.weapon = new Weapon(Items.idToString(id), id, count, skill, skillLevel);
    },

    setPendant: function(id, count, skill, skillLevel) {
        var self = this;

        if (!id)
            return;

        self.pendant = new Pendant(Items.idToString(id), id, count, skill, skillLevel);
    },

    setRing: function(id, count, skill, skillLevel) {
        var self = this;

        if (!id)
            return;

        self.ring = new Ring(Items.idToString(id), id, count, skill, skillLevel);
    },

    setBoots: function(id, count, skill, skillLevel) {
        var self = this;

        if (!id)
            return;

        self.boots = new Boots(Items.idToString(id), id, count, skill, skillLevel);
    },

    getArmour: function() {
        return this.armour;
    },

    getWeapon: function() {
        return this.weapon;
    },

    getPendant: function() {
        return this.pendant;
    },

    getRing: function() {
        return this.ring;
    },

    getBoots: function() {
        return this.boots;
    }

});