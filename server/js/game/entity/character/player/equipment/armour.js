var Equipment = require('./equipment');

module.exports = Armour = Equipment.extend({

    init: function(name, id, count, skill, skillLevel) {
        var self = this;

        self._super(name, id, count, skill, skillLevel);

        self.defense = -1;

    },

    setDefense: function(defense) {
        this.defense = defense;
    },

    getDefense: function() {
        return this.defense;
    }

});