define(['./equipment'], function(Equipment) {

    return Equipment.extend({

        init: function(name, count, skill, skillLevel) {
            var self = this;

            self._super(name, count, skill, skillLevel);
        }

    });

});