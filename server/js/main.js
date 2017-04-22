var fs = require('fs'),
    config = require('../config.json'),
    Log = require('log'),
    World = require('./game/world'),
    MySQL = require('./database/mysql'),
    WebSocket = require('./network/websocket'),
    Utils = require('./util/utils'),
    allowConnections = false;

log = new Log(config.debugLevel, config.localDebug ? fs.createWriteStream('runtime.log') : null);

function Main() {

    log.info('Initializing ' + config.name + ' game engine...');

    var worlds = [],
        webSocket = new WebSocket.Server(config.host, config.port),
        database = new MySQL(config.mysqlHost, config.mysqlPort, config.mysqlUser, config.mysqlPassword);

    webSocket.onConnect(function(connection) {
        if (!allowConnections) {
            connection.sendUTF8('errorconnecting');
            connection.close();
        }

        var world;

        for (var i = 0; i < worlds.length; i++) {
            if (worlds[i].playerCount < worlds[i].maxPlayers) {
                world = worlds[i];
                break;
            }
        }

        if (world)
            world.playerConnectCallback(connection);
        else {
            connection.sendUTF8('full');
            connection.close();
        }
    });

    webSocket.onRequestStatus(function() {
        return JSON.stringify(getPopulations(worlds));
    });

    webSocket.onError(function() {
        log.info('The Web Socket has encountered an error.');
    });

    /**
     * We want to generate worlds after the socket
     * has finished initializing.
     */

    setTimeout(function() {
        for (var i = 0; i < config.worlds; i++)
            worlds.push(new World(i + 1, webSocket));

        allowConnections = true;

        log.info('Finished parsing ' + worlds.length + ' world' + (worlds.length > 1 ? 's' : '') + '!');
    }, 400);
}

function getPopulations(worlds) {
    var counts = [];

    for (var index in worlds)
        if (worlds.hasOwnProperty(index))
            counts.push(worlds[index].playerCount);

    return counts;
}

if ( typeof String.prototype.startsWith !== 'function' ) {
    String.prototype.startsWith = function( str ) {
        return str.length > 0 && this.substring( 0, str.length ) === str;
    };
}

if ( typeof String.prototype.endsWith !== 'function' ) {
    String.prototype.endsWith = function( str ) {
        return str.length > 0 && this.substring( this.length - str.length, this.length ) === str;
    };
}

new Main();