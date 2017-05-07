var cls = require('../../../../lib/class'),
    CombatQueue = require('./combatqueue'),
    Player = require('../player/player'),
    Utils = require('../../../../util/utils');

module.exports = Combat = cls.Class.extend({

    init: function(entity) {
        var self = this;

        self.entity = entity;
        self.isPlayer = self.entity instanceof Player;

        if (self.isPlayer) {
            self.weapon = self.entity.weapon;
            self.ring = self.entity.ring;
            self.pendant = self.entity.pendant;
        }

        self.queue = new CombatQueue();
    },

    getDamage: function() {
        var self = this,
            level = self.entity.level;

        if (self.entity instanceof Player) {


        } else {


        }
    }

});