var cls = require('../lib/class'),
    Packets = require('./packets'),
    Messages = {},
    Message = cls.Class.extend({ });

module.exports = Messages;

Messages.Handshake = Message.extend({
    init: function(clientId, proceed) {
        this.clientId = clientId;
    },

    serialize: function() {
        return [Packets.Handshake, this.clientId];
    }
});

Messages.Spawn = Message.extend({
    init: function(entity) {
        this.entity = entity;
    },

    serialize: function() {
        return [Packets.Spawns].concat(this.entities.getState());
    }
});