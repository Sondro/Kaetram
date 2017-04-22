var cls = require('../lib/class'),
    mysql = require('mysql');

module.exports = MySQL = cls.Class.extend({

    init: function(host, port, user, pass) {
        var self = this;

        self.connection = mysql.createConnection({
            host: host,
            port: port,
            user: user,
            password: pass
        });

        self.connection.connect(function(err) {
            if (err) {
                log.info('An error has occurred whilst connecting to the MySQL database: ' + err);
                return;
            }

            self.loadDatabases();
        });

        self.onSelected(function() {
            log.info('Successfully established connection to the MySQL database!');
        });
    },

    loadDatabases: function() {
        var self = this;

        self.connection.query('CREATE DATABASE IF NOT EXISTS TTA', function(error, results, fields) {
            if (error)
                throw error;

            self.connection.query('USE TTA', function(error, results, fields) {
                if (self.selectDatabase_callback)
                    self.selectDatabase_callback();
            });
        });
    },

    onSelected: function(callback) {
        this.selectDatabase_callback = callback;
    }

});