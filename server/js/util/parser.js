var cls = require('../lib/class'),
    NPCData = require('../../data/npcs.json'),
    ItemData = require('../../data/items.json'),
    Items = require('./items'),
    NPCs = require('./npcs'),
    _ = require('underscore');

module.exports = Parser = cls.Class.extend({

    init: function() {
        var self = this,
            itemCounter = 0,
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
    }

});