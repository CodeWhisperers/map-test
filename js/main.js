var map;
var svg;
var zoom;
var zoomLevel = 1;
var tranlateLevel = [0,0];
var json;
var paths;
var pathPrefix = 'path-';
var customPathBase = {
    id: pathPrefix,
    classes: "planned",
    points: []
};

$(document).ready(function(){

    var winWidth = $(window).width()-10;
    var winHeight = $(window).height()-10;
    var calcHeight = winWidth / 1.799
    var xSize = 50;
    var ySize = 40;

    var xscale = d3.scale.linear()
            .domain([0,xSize])
            .range([0,winWidth]),
        yscale = d3.scale.linear()
            .domain([0,ySize])
            .range([0,/*winHeight*/ calcHeight]),
        map = d3.floorplan().xScale(xscale).yScale(yscale),
        imagelayer = d3.floorplan.imagelayer(),
        heatmap = d3.floorplan.heatmap(),
        vectorfield = d3.floorplan.vectorfield(),
        pathplot = d3.floorplan.pathplot(),
    //desks = d3.floorplan.pathplot(),
        overlays = d3.floorplan.overlays().editMode(true),
        mapdata = {};

    mapdata[imagelayer.id()] = [{
        url: 'img/etaj_1.PNG',
        x: 0,
        y: 0,
        height: ySize,
        width: xSize,
        opacity: 0.7
    }];

    map.addLayer(imagelayer)
        //.addLayer(heatmap)
        //.addLayer(vectorfield)
        .addLayer(pathplot)
        //.addLayer(overlays)
        //.addLayer(desks)
    ;

    d3.json("data/map.json", function(data) {
        json = data;
        mapdata[heatmap.id()] = data.heatmap;
        mapdata[overlays.id()] = data.overlays;
        mapdata[vectorfield.id()] = data.vectorfield;
        paths = data.pathplot;
        mapdata[pathplot.id()] = paths;
        //mapdata[desks.id()] = data.desks;

        svg = d3.select("#demo").append("svg");
        svg.attr("height", winHeight).attr("width",winWidth)
            .datum(mapdata).call(map);

        svg.on('click', function () {
            updateZoom();
            var coord = d3.mouse(this);
            var x = tranlateLevel[0]+(coord[0]*(1/zoomLevel));
            var y = tranlateLevel[1]+(coord[1]*(1/zoomLevel));
            // adjust to zoom
            x = Math.round( (x * xSize) / winWidth * 100  ) / 100;
            y = Math.round( (y * ySize) / calcHeight * 100 ) / 100;


            var crtPathName = $('#objName').val();
            var crtPath = getCrtPath(crtPathName);
            crtPath.points.push({x:x,y:y});
            //console.log(paths);
            console.log(JSON.stringify(paths));
            svg.datum(mapdata).call(map);
        });

        svg.on('mousemove', function () {
            var coord = d3.mouse(this);
            var x = Math.round( (coord[0] * xSize) / winWidth * 100  ) / 100;
            var y = Math.round( (coord[1] * ySize) / calcHeight * 100 ) / 100;
            $('#coords').text(x+', '+y);
        });
    });



});

function getCrtPath(name)
{
    for (var p in paths) {
        if (paths[p].id == pathPrefix + name) {
            return paths[p];
        }
    }
    var newPath = customPathBase;
    newPath.id = pathPrefix + name;
    paths.push(newPath);

    return newPath;
}

function saveJson()
{
    $.ajax({
        url: 'jsonSave.php',
        method: 'POST',
        data: {json:JSON.stringify(json)},
        success: function(response) {
            console.log(response);
        }
    });
}

function updateZoom()
{
    var transform = $(".map-layers").attr('transform');
    try{
        var matches = transform.match(/([+-]?\d+(\.\d+)?)/gi);
        tranlateLevel = [parseFloat(matches[0]),parseFloat(matches[1])];
        zoomLevel = parseFloat(matches[2]);
    } catch (err){
        tranlateLevel = [0,0];
        zoomLevel = 1;
    }
}
