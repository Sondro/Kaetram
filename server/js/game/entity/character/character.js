var Entity = require('../entity');

module.exports = Character = Entity.extend({

    init: function(name) {
        var self = this;

        self.name = name;
    }

});