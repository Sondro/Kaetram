define(['../character'], function(Character) {

    return Character.extend({

        init: function() {
            var self = this;

            self._super('player', Modules.Types.Player);

            self.entityId = -1;

            self.username = '';
            self.password = '';
            self.email = '';

            self.avatar = null;

            self.wanted = false;

            self.prevX = 0;
            self.prevY = 0;

            self.loadEquipment();
        },

        loadEquipment: function() {
            var self = this;

            self.armour = null;
            self.weapon = null;
            self.pendant = null;
            self.ring = null;
            self.boots = null;
        }

    });

});