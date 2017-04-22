var cls = require('../lib/class');

module.exports = Connection = cls.Class.extend({

    init: function(id, connection, server) {
        var self = this;

        self.id = id;
        self._connection = connection;
        self._server = server;
    },

    broadcast: function(message) {
        throw 'Invalid initialization.'
    },

    send: function(message) {
        throw 'Invalid initialization.'
    },

    sendUTF8: function(data) {
        throw 'Invalid initialization.'
    },

    close: function() {
        log.info('Closing connection: ' + this._connection.remoteAddress);
        this._connection.conn.close();
    }
});