/* global Class, log, Packets */

define(['./renderer/renderer', './utils/storage',
        './map/map', './network/socket', './entity/character/player/player',
        './utils/modules', './network/packets'], function(Renderer, LocalStorage, Map, Socket, Player) {

    return Class.extend({

        init: function(app) {
            var self = this;

            self.app = app;

            self.id = -1;

            self.socket = null;
            self.messages = null;
            self.renderer = null;
            self.storage = null;
            self.map = null;

            self.player = null;

            self.stopped = false;
            self.started = false;
            self.ready = false;

            self.loadRenderer();
            self.loadControllers();
            self.loadMisc();
        },

        start: function() {
            var self = this;

            self.started = true;
            self.tick();
        },

        stop: function() {
            var self = this;

            self.stopped = false;
            self.started = false;
            self.ready = false;
        },

        tick: function() {
            var self = this;

            if (self.ready) {

                self.renderer.render();

                if (!self.stopped)
                    requestAnimFrame(self.tick.bind(self));
            }
        },

        loadRenderer: function() {
            var self = this,
                background = document.getElementById('background'),
                foreground = document.getElementById('foreground'),
                textCanvas = document.getElementById('textCanvas'),
                entities = document.getElementById('entities'),
                chatInput = document.getElementById('chatInput');

            self.setRenderer(new Renderer(background, entities, foreground, textCanvas, self));
        },

        loadControllers: function() {
            var self = this;


            self.setStorage(new LocalStorage());
            self.setSocket(new Socket(self));
            self.setMessages(self.socket.messages);
        },

        loadMisc: function() {
            var self = this;

            if (self.app.hasWorker())
                self.loadMap();
        },

        loadMap: function() {
            var self = this;

            self.map = new Map(self);

            self.map.onReady(function() {
                log.info('The map has been loaded!');
            });
        },

        connect: function() {
            var self = this;

            self.app.cleanErrors();

            setTimeout(function() {
                self.socket.connect();
            }, 1000);

            self.messages.onHandshake(function(clientId) {

                self.id = clientId;

                self.ready = true;

                if (!self.player)
                    self.createPlayer();

                self.app.updateLoader('Logging in');

                if (self.app.isRegistering()) {
                    var registerInfo = self.app.registerFields,
                        username = registerInfo[0].val(),
                        password = registerInfo[1].val(),
                        email = registerInfo[2].val();

                    self.socket.send(Packets.Intro, [Packets.Opcode.Register, username, password, email]);
                } else {
                    var loginInfo = self.app.loginFields,
                        name = loginInfo[0].val(),
                        pass = loginInfo[1].val();

                    self.socket.send(Packets.Intro, [Packets.Opcode.Login, name, pass]);
                }
            });

            self.messages.onWelcome(function(playerData) {

                self.player.entityId = playerData.shift();

            });

            self.messages.onSpawn(function() {

            });
        },

        handleDisconnection: function() {
            var self = this;

            /**
             * This function is responsible for handling sudden
             * disconnects of a player whilst in the game, not
             * menu-based errors.
             */

            if (!self.started)
                return;

            log.info('Player has been disconnected...');

            self.app.toggleLogin(false);
            self.app.sendError(null, 'You have been disconnected from the server...');
        },

        createPlayer: function() {
            var self = this;

            self.player = new Player();
        },

        getScaleFactor: function() {
            return this.app.getScaleFactor();
        },

        getStorage: function() {
            return this.storage;
        },

        getSocket: function() {
            return this.socket;
        },

        setRenderer: function(renderer) {
            if (!this.renderer)
                this.renderer = renderer;
        },

        setStorage: function(storage) {
            if (!this.storage)
                this.storage = storage;
        },

        setSocket: function(socket) {
            if (!this.socket)
                this.socket = socket;
        },

        setMessages: function(messages) {
            if (!this.messages)
                this.messages = messages;
        }

    });

});