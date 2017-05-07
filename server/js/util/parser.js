var cls = require('../lib/class'),
    NPCData = require('../../data/npcs.json'),
    ItemData = require('../../data/items.json'),
    Items = require('./items'),
    NPCs = require('./npcs'),
    _ = require('underscore'),
    Formulas = require('../game/formulas');

module.exports = Parser = cls.Class.extend({

    init: function() {
        var self = this;

        self.loadNPCData();
        self.loadItemData();
        self.loadLevels();
    },

    loadNPCData: function() {
        var self = this,
            npcCounter = 0;

        _.each(NPCData, function(value, key) {
            key = key.toLowerCase();

            NPCs.Properties[key] = {
                key: key,
                npcId: value.npcId,
                name: value.name ? value.name : key
            };

            NPCs.Ids[value.npcId] = NPCs.Properties[key];

            npcCounter++;
        });

        log.info('Finished loading ' + npcCounter + ' NPCs.');
    },

    loadItemData: function() {
        var self = this,
            itemCounter = 0;

        _.each(ItemData, function(value, key) {
            key = key.toLowerCase();

            Items.Data[key] = {
                key: key,
                id: value.id ? value.id : -1,
                type: value.type ? value.type : 'object',
                attack: value.attack ? value.attack : 0,
                defense: value.defense ? value.defense : 0,
                name: value.name ? value.name : key,
                price: value.price ? value.price : 1,
                storeCount: value.storeCount ? value.storeCount : 1
            };

            Items.Ids[value.id] = Items.Data[key];

            itemCounter++;
        });

        log.info('Finished loading ' + itemCounter + ' items.');
    },

    loadLevels: function() {

        Formulas.LevelExp[0] = 0;

        for (var i = 1; i < 130; i++) {
            var points = Math.floor(0.25 * Math.floor(i + 300 * Math.pow(2, i / 7)));
            Formulas.LevelExp[i] = points + Formulas.LevelExp[i - 1];
        }

    }

});