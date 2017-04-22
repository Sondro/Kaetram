var Character = require('../character');

module.exports = Player = Character.extend({

    init: function(world, database, connection) {
        var self = this;

        self.world = world;
        self.database = database;
        self.connection = connection;

        self.id = self.connection.id;
    }

});