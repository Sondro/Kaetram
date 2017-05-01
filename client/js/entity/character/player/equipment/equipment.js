define(function() {

    /**
     * The children of these classes are responsible for
     * clear and concise ways of organizing stats of weapons
     * in the client side. This does not dictate the damage,
     * defense or bonus stats, it's just for looks.
     */

    return Class.extend({

        init: function(kind, points, skill, skillLevel) {
            var self = this;

            self.kind = kind;
            self.points = points;
            self.skill = skill;
            self.skillLevel = skillLevel;
        },

        getKind: function() {
            return this.kind;
        },

        getPoints: function() {
            return this.points;
        },

        getSkill: function() {
            return this.skill;
        },

        getSkillLevel: function() {
            return this.skillLevel;
        }

    });

});