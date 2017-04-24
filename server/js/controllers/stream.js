/* global module */

var cls = require('../lib/class');

module.exports = Stream = cls.Class.extend({

    init: function(player) {
        var self = this;

        self.player = player;
        self.connection = self.player.connection;
    }

});