// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

var graymap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    
    {
        attribution:
            "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    }
);


var streetmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    
    {
        attribution:
            "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    }
);

var darkmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    
    {
        attribution:
            "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    }
);

var map = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 5,

    layers: [graymap, streetmap, darkmap]

});

graymap.addTo(map);

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
    // then, send the layer to the createMap() function.
    var earthquakes = L.geoJSON(data.features, {
        fillOpacity: 0.75,
        color: "black",
        fillColor: "color",
        radius: data.features * 2000
    }).bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <p> ${Date(feature.properties.time)} </p>`)
      .addTo(myMap);
    
    // creatFeatures(data.features);

    L.createMap(earthquakes, function (){

        // Define a baseMaps object to hold our base layers
        var baseMaps = {
            "Street Map": streetmap,
            "Dark Map": darkmap
        }
    
        // Create overlay object to hold our overlay layer
        var overlayMaps = {
            "Earthquakes": earthquakes
        }
    
        // Create our map, giving it the streetmap and earthquakes layers to display on load
    
    
        // Create a layer control
        // Pass in our baseMaps and overlayMaps
        // Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap)
    
    });

});

function getColor(mag) {
    if (mag <= 1) {
        return "#DFFF00";
    }
    if (mag <= 3) {
        return "#DFFF00";
    }
    if (mag <= 5) {
        return "#808000";
    }
    if (mag <= 7) {
        return "#00FF00";
    }
    if (mag <= 9) {
        return "#008000";
    }
}

function creatFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    function onEachFeature(feature, layer) {
        // Give each feature a popup describing the place and time of the earthquake
        layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <p> ${Date(feature.properties.time)} </p>`);
    }

    function PointTolayer(feature, latlng) {
        return L.circleMarker(latlng, {
            fillOpacity: 1,
            radius: feature.properties.mag,
            color: getColor(feature.properties.mag)

        })
        // return circle

    };

    var earthquake = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        PointTolayer: PointTolayer

    });
    createMap(earthquake);
};

// legend; check class material