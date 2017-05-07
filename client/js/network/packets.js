Packets = {
    Handshake: 0,
    Intro: 1,
    Welcome: 2,
    Spawn: 3,
    Equipment: 4,
    Ready: 5
};

Packets.IntroOpcode = {
    Login: 0,
    Register: 1
};

Packets.EquipmentOpcode = {
    Batch: 0,
    Equip: 1,
    Unequip: 2
};