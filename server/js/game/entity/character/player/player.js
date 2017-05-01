/* global module */

var Character = require('../character'),
    Incoming = require('../../../../controllers/incoming');

module.exports = Player = Character.extend({

    init: function(world, database, connection) {
        var self = this;

        self.world = world;
        self.mysql = database;
        self.connection = connection;

        self.id = self.connection.id;
        self.clientId = -1;

        self.incoming = new Incoming(self);

    }

});