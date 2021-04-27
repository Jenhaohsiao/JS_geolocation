var coordsNumbers = document.getElementById("coordsNumbers");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        coordsNumbers.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    coordsNumbers.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
    myMap(position.coords)
}

function initMap() {
    const map = new google.maps.Map(document.getElementById("googleMap"), {
        zoom: 16,
        center: {
            lat: -34.397,
            lng: 150.644
        },
    });
    const geocoder = new google.maps.Geocoder();
    document.getElementById("submit").addEventListener("click", () => {
        geocodeAddress(geocoder, map);
    });
}


function myMap(_coords) {

    var _latitude = (_coords && _coords.latitude) ? _coords.latitude : 43.642567
    var _longitude = (_coords && _coords.longitude) ? _coords.longitude : -79.387054

    const myLatLng = {
        lat: _latitude,
        lng: _longitude
    };

    // var webMap = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    const map = new google.maps.Map(document.getElementById("googleMap"), {
        zoom: 16,
        center: myLatLng,
    });
    new google.maps.Marker({
        position: myLatLng,
        map,
        title: "Hello World!",
    });
}

// geocoding address
const geocoder = new google.maps.Geocoder();

document.getElementById("submit").addEventListener("click", () => {
    geocodeAddress(geocoder, map);

});

function geocodeAddress(geocoder, resultsMap) {
    const address = document.getElementById("address").value;
    geocoder.geocode({
        address: address
    }, (results, status) => {
        if (status === "OK") {
            resultsMap.setCenter(results[0].geometry.location);
            new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
            });

            // myMap(results[0].geometry.location)
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}