var cls = require('../../../../lib/class'),
    _ = require('underscore'),
    async = require('async');

module.exports = CombatQueue = cls.Class.extend({

    init: function() {
        var self = this;

        self.hitQueue = [];
    },

    process: function() {
        var self = this;


    },

    clear: function() {
        this.hitQueue = [];
    }

});