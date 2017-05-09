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

           self.setGridPosition(50, 90);
       },

       load: function() {
            var self = this,
                factor = self.renderer.getScale();

            self.gridWidth = 15 * factor;
            self.gridHeight = 8 * factor;
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
       },

       forEachVisiblePosition: function(callback) {
           var self = this;

           for(var y = self.gridY - 1, maxY = y + self.gridHeight + 2; y < maxY; y++) {
               for(var x = self.gridX - 1, maxX = x + self.gridWidth + 2; x < maxX; x++)
                   callback(x, y);
           }
       },

       move: function(newX, newY) {
           var self = this,
               oldPos = {
                   x: self.camera.x,
                   y: self.camera.y
               };


       }

   });

});