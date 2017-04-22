var cls = require('../../lib/class');

module.exports = Entity = cls.Class.extend({

    init: function(id, kind) {
        var self = this;

        self.id = id;
        self.kind = kind;
    }

});