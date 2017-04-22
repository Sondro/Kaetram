/* global log, Class */

define(['jquery'], function($) {

    return Class.extend({

        init: function() {
            var self = this;

            log.info('Loading the main application...');

            self.body = $('body');
            self.parchment = $('#parchment');

            self.loginButton = $('.login');
            self.registerButton = $('.createNew');

            self.game = null;

            self.load();

        },

        load: function() {
            var self = this;

            self.body.click(function(event) {
                log.info(self.parchment.className);

                /**

                 self.toggleScroll(self.parchment.className);


                 */
            });

            self.loginButton.click(function(event) {
                log.info('Login');
            });

            self.registerButton.click(function(event) {
                log.info('Register');
            });

        },

        scroll: function(origin, destination) {
            var self = this,
                parchment = $('#parchment'),
                duration = 1;

            if (destination) {

            } else {



            }
        },

        resize: function() {
            log.info('Screen resized, scale: ' + this.getScaleFactor());
            log.info('Supports workers: ' + this.hasWorker());
        },

        setGame: function(game) {
            this.game = game;
        },

        randomFunction: function() {
            log.info('Just testing..');
        },

        hasWorker: function() {
            return !!window.Worker;
        },

        getScaleFactor: function() {
            var width = window.innerWidth,
                height = window.innerHeight;

            /**
             * These are raw scales, we can adjust
             * for up-scaled rendering in the actual
             * rendering file.
             */

            return width <= 1000 ? 1 : ((width <= 1500 || height <= 870) ? 2 : 3);
        },

        isMobile: function() {
            return this.getScaleFactor() < 2;
        },

        isTablet: function() {
            return Detect.isIpad() || (Detect.isAndroid() && this.getScaleFactor() > 1);
        }

    });

});