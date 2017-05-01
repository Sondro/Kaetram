var cls = require('../lib/class'),
    Packets = require('../network/packets');

module.exports = Incoming = cls.Class.extend({

    init: function(player) {
        var self = this;

        self.player = player;
        self.connection = self.player.connection;
        self.world = self.player.world;
        self.mysql = self.player.mysql;

        self.connection.listen(function(data) {

            var packet = data.shift(),
                message = data[0];

            switch(packet) {

                case Packets.Intro:
                    self.handleIntro(message);
                    break;

            }

        });
    },

    handleIntro: function(message) {
        var self = this,
            loginType = message.shift(),
            username = message.shift().toLowerCase(),
            password = message.shift(),
            isRegistering = loginType === Packets.Opcode.Register,
            email = isRegistering ? message.shift() : '',
            formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);

        self.player.username = formattedUsername.substr(0, 32).trim();
        self.player.password = password.substr(0, 32);
        self.player.email = email.substr(0, 128);

        if (isRegistering)
            self.mysql.register(self.player);
        else
            self.mysql.login(self.player);
    }

});