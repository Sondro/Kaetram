define(function() {

    return Class.extend({

        init: function() {
            var self = this;

            self.chatInput = null;
        },

        setChatInput: function(chatInput) {
            this.chatInput = chatInput;
        }

    });

});