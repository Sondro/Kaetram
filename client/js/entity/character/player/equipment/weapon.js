define(['./equipment'], function(Equipment) {

    return Equipment.extend({

        init: function(name, count, skill, skillLevel) {
            var self = this;

            self._super(name, count, skill, skillLevel);

            self.level = -1;
            self.damage = -1;
        },

        setDamage: function(damage) {
            this.damage = damage;
        },

        setLevel: function(level) {
            this.level = level;
        },

        getDamage: function() {
            return this.damage;
        },

        getLevel: function() {
            return this.level;
        }

    });

});