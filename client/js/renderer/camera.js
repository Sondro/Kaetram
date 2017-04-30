define(function() {

   return Class.extend({

       init: function(renderer) {
           var self = this;

           self.renderer = renderer;

           self.offset = 0.5;
           self.x = 0;
           self.y = 0;
           self.gridX = 0;
           self.gridY = 0;

           self.load();
       },

       load: function() {
            var self = this,
                factor = self.renderer.getScaleFactor();

            self.gridWidth = 15 * factor;
            self.gridHeight = 7 * factor;
       },

       setPosition: function(x, y) {
            var self = this;

            self.x = x;
            self.y = y;

            self.gridX = Math.floor(x / 16);
            self.gridY = Math.floor(y / 16);
       },

       setGridPosition: function(x, y) {
            var self = this;

            self.gridX = x;
            self.gridY = y;

            self.x = self.gridX * 16;
            self.y = self.gridY * 16;
       }

   });

});