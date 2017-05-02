var Equipment = require('./equipment');

module.exports = Weapon = Equipment.extend({

    init: function(name, id, count, skill, skillLevel) {
        var self = this;

        self._super(name, id, count, skill, skillLevel);

        self.damage = -1;
    },

    setDamage: function(damage) {
        this.damage = damage;
    },

    getDamage: function() {
        return this.damage;
    }

});