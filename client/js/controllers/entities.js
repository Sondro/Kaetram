define(['../renderer/grids', '../entity/objects/chest',
        '../entity/character/character', '../entity/character/player/player',
        '../entity/objects/item'], function(Grids, Chest, Character, Player, Item) {

    return Class.extend({

        init: function(game) {
            var self = this;

            self.game = game;

            self.grids = null;

            self.entities = {};
        },

        load: function() {
            var self = this;

            if (!self.grids)
                self.grids = new Grids(self.game.map);
        },

        addEntity: function(entity) {
            var self = this;

            if (self.entities[entity.id])
                return;

            self.entities[entity.id] = entity;

            /**
             * TODO: Dirty and fading here
             */
        },

        addItem: function(item, x, y) {
            //TODO - Sprite controller necessary
        },

        removeItem: function(item) {
            var self = this;

            if (!item)
                return;

            self.grids.removeFromItemGrid(item, item.gridX, item.gridY);
            self.grids.removeFromRenderingGrid(item, item.gridX, item.gridY);

            delete self.entities[item.id];
        },

        registerPosition: function(entity) {
            var self = this;

            if (!entity)
                return;

            if (entity instanceof Character || entity instanceof Chest) {
                self.grids.addToEntityGrid(entity, entity.gridX, entity.gridY);

                if (!(entity instanceof Player))
                    self.grids.addToPathingGrid(entity.gridX, entity.gridY);
            }

            if (entity instanceof Item)
                self.grids.addToItemGrid(entity, entity.gridX, entity.gridY);

            self.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);
        },

        unregisterPosition: function(entity) {
            var self = this;

            if (!entity)
                return;

            self.grids.removeEntity(entity);
        }

    });

});