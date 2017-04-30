importScripts('../../data/maps/world_client.js');

onmessage = function(event) {

    loadCollisionGrid();

    postMessage(mapData);
};

function loadCollisionGrid() {
    var tileIndex = 0;

    mapData.grid = [];

    for (var i = 0; i < mapData.height; i++) {
        mapData.grid[i] = [];
        for (var j = 0; j < mapData.width; j++)
            mapData.grid[i][j] = 0;
    }

    for (var c = 0; c < mapData.collisions.length; c++) {
        var cPosition = indexToGridPosition(mapData.collisions[c] + 1);
        mapData.grid[cPosition.x][cPosition.y] = 1;
    }

    for (var b = 0; b < mapData.blocking.length; b++) {
        var bPosition = indexToGridPosition(mapData.blocking[b] + 1);
        if (mapData.grid[bPosition.y] !== undefined)
            mapData.grid[bPosition.y][bPosition.x] = 1;
    }
}

function indexToGridPosition(index) {
    var x = 0, y = 0;

    index -= 1;

    x = getX(index + 1, mapData.width);
    y = Math.floor(index / mapData.width);

    return {
        x: x,
        y: y
    }
}

function getX(index, width) {
    if (index === 0)
        return 0;

    return (index % width === 0) ? width - 1 : (index % width) - 1;
}