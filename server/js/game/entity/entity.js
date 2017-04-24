/* global module */

var cls = require('../../lib/class');

module.exports = Entity = cls.Class.extend({

    init: function(id, kind, x, y) {
        var self = this;

        self.id = id;
        self.kind = kind;

        self.x = x;
        self.y = y;

        self.recentGroups = [];
    },

    getState: function() {
        var self = this;

        return [
            parseInt(self.id, 10),
            self.kind,
            self.x,
            self.y
        ]
    }

});