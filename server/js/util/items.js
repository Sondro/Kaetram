var Items = {};

Items.Data = {};
Items.Ids = {};

Items.idToString = function(id) {
    if (id in Items.Ids)
        return Items.Ids[id].key;

    return 'null';
};

Items.stringToId = function(name) {
    if (name in Items.Data)
        return Items.Data[name].id;

    return 'null';
};

module.exports = Items;