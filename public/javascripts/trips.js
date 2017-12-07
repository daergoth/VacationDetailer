$(function() {
    $("#deleteButton").click(function() {
        let path = window.location.pathname;
        
        var tripId = /trip(s)?\/(.+)/.exec(path);
        tripId = tripId[tripId.length - 1];
        
        $.ajax({
            url: "/api/trips/" + tripId,
            type: "DELETE"
        })
        .then(function() {
            window.location.href = "/trips";
        });
    });
});

function loadTrip() {
    let path = window.location.pathname;

    var tripId = /trip(s)?\/(.+)/.exec(path);
    tripId = tripId[tripId.length - 1];

    $.ajax({
        url: "/api/trips/" + tripId,
        type: "GET",
        dataType: "json"
    })
        .then(function (data) {
            return calculateMapData(data);
        })
        .then(function (mapData) {
            initMap(mapData);
        });
}

function calculateMapData(data) {
    let mapBounds = data.trip.places.reduce((accumulator, currentValue) => {
        return {
            minLat: Math.min(accumulator.minLat, currentValue.lat),
            minLng: Math.min(accumulator.minLng, currentValue.lon),
            maxLat: Math.max(accumulator.maxLat, currentValue.lat),
            maxLng: Math.max(accumulator.maxLng, currentValue.lon)
        };
    }, { minLat: 1000, minLng: 1000, maxLat: -1000, maxLng: -1000 });

    let mapCenter = {
        lat: (mapBounds.minLat + mapBounds.maxLat) / 2,
        lng: (mapBounds.minLng + mapBounds.maxLng) / 2
    };

    return {
        bounds: mapBounds,
        center: mapCenter,
        orderedPlaces: data.trip.places
    };
}

var map;

function initMap(mapData) {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 1,
        center: {
            lat: mapData.center.lat,
            lng: mapData.center.lng
        }
    });
    directionsDisplay.setMap(map);

    var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(mapData.bounds.minLat, mapData.bounds.minLng),
        new google.maps.LatLng(mapData.bounds.maxLat, mapData.bounds.maxLng));

    map.fitBounds(bounds);

    let routeOrigin = mapData.orderedPlaces[0];
    let routeDest = mapData.orderedPlaces[mapData.orderedPlaces.length - 1];
    let waypoints = mapData.orderedPlaces.slice(1, mapData.orderedPlaces.length - 1)
        .map(p => {
            return {
                location: {
                    lat: p.lat,
                    lng: p.lon
                }
            };
        });

    directionsService.route({
        origin: { lat: routeOrigin.lat, lng: routeOrigin.lon },
        destination: { lat: routeDest.lat, lng: routeDest.lon },
        waypoints: waypoints,
        travelMode: "DRIVING"
    },
        function (result, status) {
            if (status == 'OK') {
                console.log(result);

                directionsDisplay.setDirections(result);
            } else {
                console.log(status, result);

                let alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

                mapData.orderedPlaces.forEach((p, i) => {
                    var marker = new google.maps.Marker({
                        position: {lat: p.lat, lng: p.lon},
                        map: map,
                        label: alphabet[i]
                      });
                });
            }
        });
}