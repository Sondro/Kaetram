'use strict';

require.config({
    paths: {
        jquery: 'lib/jquery'
    },

    modules: [
        {
            name: 'jquery'
        },

        {
            name: 'game',
            exclude: ['jquery']
        },

        {
            name: 'home',
            exclude: ['jquery', 'game']
        }
    ]
});