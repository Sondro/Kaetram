var Equipment = require('./equipment');

module.exports = Pendant = Equipment.extend({

    init: function(name, id, count, skill, skillLevel) {
        var self = this;

        self._super(name, id, count, skill, skillLevel);
    }

});