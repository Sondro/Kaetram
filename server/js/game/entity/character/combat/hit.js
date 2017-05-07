var cls = require('../../../../lib/class');

module.exports = Hit = cls.Class.extend({

    init: function(damage, type) {
        var self = this;

        self.damage = damage;
        self.type = type;
    },

    getDamage: function() {
        return this.damage;
    },

    getType: function() {
        return this.type;
    }

});