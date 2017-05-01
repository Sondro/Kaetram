var cls = require('../lib/class'),
    mysql = require('mysql');

module.exports = MySQL = cls.Class.extend({

    init: function(host, port, user, pass) {
        var self = this;

        /**
         * Don't bother hacking into the MySQL database,
         * it is empty and for testing purposes, and will
         * be erased as soon as Kaetram is finished and
         * moved back into TTA.
         */

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

    login: function(player) {
        var self = this;

        log.info('Logging in player...');

        self.query('SELECT * FROM `player_data`, `player_equipment` WHERE `player_data`.`name`=' + "'" + player.username + "'", function(error, rows, fields) {
            if (error)
                throw error;

            for (var index in rows) {
                if (rows.hasOwnProperty(index)) {
                    var row = rows[index];

                    if (row.name === player.name) {

                        log.info('Just set data here...');

                        return;
                    }
                }
            }

            self.register(player);
        });
    },

    register: function(player) {
        var self = this;

        log.info('Registering player...');
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

    query: function(parameters, callback) {
        var self = this;

        self.connection.query('USE TTA', function(error, results, fields) {
            if (error)
                throw error;

            self.connection.query(parameters, function(error, rows, fields) {
                callback(error, rows, fields);
            });
        });
    },

    onSelected: function(callback) {
        this.selectDatabase_callback = callback;
    }

});