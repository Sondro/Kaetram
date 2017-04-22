var Area = require('../area'),
    _ = require('underscore');

module.exports = PVP = Area.extend({

    init: function(id, x, y, width, height) {
        var self = this;

        self.id = id;
        self.x = x;
        self.y = y;
        self.width = width;
        self.height = height;
    }

});