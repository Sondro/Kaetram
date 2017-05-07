define(['./equipment'], function(Equipment) {

    return Equipment.extend({

        init: function(name, count, skill, skillLevel) {
            var self = this;

            self._super(name, count, skill, skillLevel);

            self.defence = -1;
        },

        setDefence: function(defence) {
            this.defence = defence;
        },

        getDefence: function() {
            return this.defence;
        }

    });

});