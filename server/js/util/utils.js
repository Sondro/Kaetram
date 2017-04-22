var Utils = {};

module.exports = Utils;

Utils.random = function(range) {
    return Math.floor(Math.random() * range);
};

Utils.randomInt = function(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
};