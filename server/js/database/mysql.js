var cls = require('../lib/class'),
    mysql = require('mysql'),
    Creator = require('./creator'),
    _ = require('underscore');

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

            self.creator.createDatabases();
        });

        self.creator = new Creator(self);
    },

    login: function(player) {
        var self = this,
            found;

        log.info('Logging in player...');

        self.query('SELECT * FROM `player_data`, `player_equipment` WHERE `player_data`.`username`=' + "'" + player.username + "'", function(error, rows, fields) {
            if (error)
                throw error;

            _.each(rows, function(row) {
                if (row.name === player.username) {
                    found = true;

                    log.info('Found the player here...');
                }
            });

            if (!found)
                self.register(player);
        });
    },

    register: function(player) {
        var self = this;

        self.query('SELECT * FROM `player_data` WHERE `player_data`.`username`=' + "'" + player.username + "'", function(error, rows, fields) {
            var exists;

            _.each(rows, function(row) {
                if (row.name === player.username)
                    exists = true;
            });

            if (!exists) {
                log.info('Player: ' + player.username + ' does not exist, registering...');

                player.isNew = true;
                player.load(self.creator.getPlayerData(player));
                self.creator.save(player);
                player.intro();
            }
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