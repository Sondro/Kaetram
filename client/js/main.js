/* global log, Detect */

define(['jquery', './app', './game'], function($, App, Game) {

    var app, body, chatInput, game;

    var load = function() {

        $(document).ready(function() {
            app = new App();
            body = $('body');
            chatInput = $('#chatInput');

            addClasses();
            addListeners();

            initGame();
        });

    };

    var addClasses = function() {
        var self = this;

        if (Detect.isWindows())
            body.addClass('windows');

        if (Detect.isOpera())
            body.addClass('opera');

        if (Detect.isFirefoxAndroid())
            chatInput.removeAttr('placeholder');

    };

    var addListeners = function() {
        var self = this,
            resizeCheck = $('#resizeCheck');

        document.addEventListener('touchstart', function() {}, false);
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        });

        resizeCheck.bind('transitionend', app.resize.bind(app));
        resizeCheck.bind('webkitTransitionEnd', app.resize.bind(app));
        resizeCheck.bind('oTransitionEnd', app.resize.bind(app));

        $(window).blur(function() {
             log.info('Screen out of focus - do stuff here.');
        });

        $(window).focus(function() {
             log.info('Screen focused again.');
        });
    };

    var initGame = function() {

        game = new Game(app);

        app.setGame(game);

    };


    load();
});