var cls = require('../lib/class');

module.exports = Creator = cls.Class.extend({

    init: function(mysql) {
        var self = this;

        self.mysql = mysql;
        self.connection = self.mysql.connection;
    },

    createDatabases: function() {
        var self = this;

        self.connection.query('CREATE TABLE IF NOT EXISTS player_data (' +
            'username varchar(64),' +
            'password varchar(64),' +
            'email varchar(64),' +
            'x int,' +
            'y int,' +
            'exp int,' +
            'kind int,' +
            'rights int,' +
            'class int,' +
            'poisoned tinyint,' +
            'hitpoints int,' +
            'mana int,' +
            'pvpKills int,' +
            'pvpDeaths int,' +
            'rank int,' +
            'ban int(64),' +
            'membership int(64),' +
            'TTACoins int(32),' +
            'PRIMARY KEY(username))');

        self.connection.query('CREATE TABLE IF NOT EXISTS player_equipment (' +
            'username varchar(64),' +
            'armour varchar(64),' +
            'weapon varchar(64),' +
            'pendant varchar(64),' +
            'ring varchar(64),' +
            'boots varchar(64),' +
            'armourEnchantedPoint tinyint,' +
            'armourSkillKind tinyint,' +
            'armourSkillLevel tinyint,' +
            'weaponEnchantedPoint tinyint,' +
            'weaponSkillKind tinyint,' +
            'weaponSkillLevel tinyint,' +
            'pendantEnchantedPoint tinyint,' +
            'pendantSkillKind tinyint,' +
            'pendantSkillLevel tinyint,' +
            'ringEnchantedPoint tinyint,' +
            'ringSkillKind tinyint,' +
            'ringSkillLevel tinyint,' +
            'bootsEnchantedPoint tinyint,' +
            'bootsSkillKind tinyint,' +
            'bootsSkillLevel tinyint,' +
            'PRIMARY KEY(username))');

        self.connection.query('CREATE TABLE IF NOT EXISTS player_quest (' +
            'username varchar(64),' +
            'id tinyint,' +
            'progress smallint,' +
            'PRIMARY KEY(username))');

        self.connection.query('CREATE TABLE IF NOT EXISTS player_bank (' +
            'username varchar(64),' +
            'ids text COLLATE utf8_unicode_ci NOT NULL,' +
            'counts text COLLATE utf8_unicode_ci NOT NULL,' +
            'skillKinds text COLLATE utf8_unicode_ci NOT NULL,' +
            'skillLevels text COLLATE utf8_unicode_ci NOT NULL,' +
            'PRIMARY KEY(username))');

        self.connection.query('CREATE TABLE IF NOT EXISTS player_skills (' +
            'username varchar(64),' +
            'skills text COLLATE utf8_unicode_ci NOT NULL,' +
            'skillLevels text COLLATE utf8_unicode_ci NOT NULL,' +
            'skillSlots text COLLATE utf8_unicode_ci NOT NULL,' +
            'PRIMARY KEY (username))');

        self.connection.query('CREATE TABLE IF NOT EXISTS player_inventory (' +
            'username varchar(64),' +
            'ids text COLLATE utf8_unicode_ci NOT NULL,' +
            'counts text COLLATE utf8_unicode_ci NOT NULL,' +
            'skillKinds text COLLATE utf8_unicode_ci NOT NULL,' +
            'skillLevels text COLLATE utf8_unicode_ci NOT NULL,' +
            'PRIMARY KEY(username))');

        self.connection.query('CREATE TABLE IF NOT EXISTS ipbans (' +
            'ip varchar(64),' +
            'ipban int(64),' +
            'PRIMARY KEY(ip))');
    },

    save: function(player) {
        var self = this,
            isNew = player.isNew,
            queryKey = isNew ? 'INSERT INTO' : 'UPDATE';

        self.mysql.query(queryKey + '`player_data` SET ?', {
            username: player.username,
            password: player.password,
            email: player.email,
            x: player.x,
            y: player.y,
            experience: player.experience,
            kind: player.kind,
            rights: player.rights,
            ban: player.ban,
            membership: player.membership,
            lastLogin: player.lastLogin,
            pvpKills: player.pvpKills,
            pvpDeaths: player.pvpDeaths
        });

        var armour = player.getArmour(),
            weapon = player.getWeapon(),
            pendant = player.getPendant(),
            ring = player.getRing(),
            boots = player.getBoots();

        self.mysql.query(queryKey + '`player_equipment` SET ?', {
            username: player.username,
            armour: armour.getName(),
            weapon: weapon.getName(),
            pendant: pendant.getName(),
            ring: ring.getName(),
            boots: boots.getName(),
            armourEnchantedPoint: armour.getCount(),
            armourSkill: armour.getSkill(),
            armourSkillLevel: armour.getSkillLevel(),
            weaponEnchantedPoint: weapon.getCount(),
            weaponSkill: weapon.getSkill(),
            weaponSkillLevel: weapon.getSkillLevel(),
            pendantEnchantedPoint: pendant.getCount(),
            pendantSkill: pendant.getSkill(),
            pendantSkillLevel: pendant.getSkillLevel(),
            ringEnchantedPoint: ring.getCount(),
            ringSkill: ring.getSkill(),
            ringSkillLevel: ring.getSkillLevel(),
            bootsEnchantedPoint: boots.getCount(),
            bootsSkill: boots.getSkill(),
            bootsSkillLevel: boots.getSkillLevel()
        });
    },

    getPlayerData: function(player) {
        return {
            username: player.username,
            password: player.password,
            email: player.email ? player.email : 'null',
            x: 0,
            y: 0,
            kind: 0,
            rights: 0,
            hitPoints: 100,
            mana: 15,
            experience: 0,
            ban: 0,
            membership: 0,
            lastLogin: 0,
            armour: ['clotharmor', 0, 0, 0],
            pvpKills: 0,
            pvpDeaths: 0,
            weapon: ['', 0, 0, 0],
            pendant: ['', 0, 0, 0],
            ring: ['', 0, 0, 0],
            boots: ['', 0, 0, 0]
        }
    }

});