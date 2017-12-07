var map;
var geocoder;
var places = [];

$(function() {
    $(".placeItem").dblclick(function() {
        $(this).attr('contentEditable', true);
    }).blur(function() {
        $(this).attr('contentEditable', false);

        places[this.dataset.id].name = $(this).text();
    });

    $("#searchButton").click(function(){
        let searchText = $("#searchText");

        if (map) {
            geocoder.geocode({
                address: searchText.val()
            }, function(resp) {
                if (resp.length > 0) {
                    let result = resp[0];
    
                    searchText.val(result.formatted_address);
    
                    map.panTo(result.geometry.location);
                    map.fitBounds(result.geometry.bounds);
                }
            });
        }
    });

    $("#saveButton").click(function() {
        let placesToSave = places.map(p => {
            return {
                name: p.name,
                lat: p.lat,
                lon: p.lon
            }
        })

        if ($("#tripName").val() != '' && places.length > 1) {
            $.ajax({
                url: "/api/trips/",
                type: "POST",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    trip: {
                        name: $("#tripName").val(),
                        places: placesToSave
                    }
                })
            })
            .then(function (data) {
                window.location.href = "/trips/" + data.id;
            });
        } else {
            
        }
    });
});

function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 1,
        center: {
            lat: 0,
            lng: 0
        }
    });

    map.addListener("rightclick", function(e) {
        addMarker(e.latLng);
    });
}

function addMarker(latlng) {
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        draggable: true
      });

    geocoder.geocode({
        location: latlng
    }, function(resp) {
        let place = {
            lat: latlng.lat(),
            lon: latlng.lng(),
            marker: marker,
            name: resp[0].formatted_address
        };
            
        marker.addListener("dragend", function(e) {
            geocoder.geocode({
                location: e.latLng
            }, function(resp) {
                place.lat = e.latLng.lat();
                place.lon = e.latLng.lng();
                place.name = resp[0].formatted_address;

                refreshPlaces();
            });
        });

        places.push(place);
        refreshPlaces();
    });
}

function refreshPlaces() {
    $("#placesList").html("");

    for (let i = 0; i < places.length; ++i) {
        let p = places[i];

        let element = $(`<li></li>`, {
            "class": "list-group-item"
        });

        let nameElement = $("<div></div>", {
            "class": "d-inline-block w-75 h6",
            "data-id": i,
            text: p.name,
            dblclick: function() {
                $(this).attr('contentEditable', true);
                $(this).focus();
            },
            blur: function() {
                $(this).attr('contentEditable', false);
                
                places[this.dataset.id].name = $(this).text();
            }
        });

        nameElement.appendTo(element);

        let controlElement = $("<div>", {
            "class": "text-right"
        });

        let deleteElement = $('<button></button>', {
            "type": "button",
            "class": "btn btn-outline-danger btn-sm mr-2",
            "data-id": i,
            html: "<i class=\"fa fa-remove\" aria-hidden=\"true\"></i>",
            click: function() {
                places[i].marker.setVisible(false);
                places.splice(this.dataset.id, 1);
                refreshPlaces();
            }
        });

        deleteElement.appendTo(controlElement);

        let moveElement = $('<button></button>', {
            "type": "button",
            "class": "btn btn-outline-primary btn-sm",
            "data-lat": p.lat,
            "data-lon": p.lon,
            html: "<i class=\"fa fa-arrow-right\" aria-hidden=\"true\"></i>",
            click: function() {
                map.panTo({lat: parseFloat(this.dataset.lat), lng: parseFloat(this.dataset.lon)});
            }
        });

        moveElement.appendTo(controlElement);

        controlElement.appendTo(element);

        element.appendTo("#placesList");
    }

   
}
