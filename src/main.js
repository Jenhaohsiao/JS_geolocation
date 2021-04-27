var coordsNumbers = document.getElementById("coordsNumbers");
var addressText = document.getElementById("addressText");

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
    displayOnMap(position.coords)
    getAddress(position.coords)


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


function displayOnMap(_coords) {

    const _latitude = (_coords && _coords.latitude) ? _coords.latitude : 43.642567
    const _longitude = (_coords && _coords.longitude) ? _coords.longitude : -79.387054

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

            // displayOnMap(results[0].geometry.location)
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

function getAddress(_coords) {

    const _latitude = _coords.latitude;
    const _longitude = _coords.longitude;

    const myLatLng = {
        lat: _latitude,
        lng: _longitude
    };

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        location: myLatLng
    }, (results, status) => {
        if (status === "OK") {
            if (results[0]) {
                console.log("results[0].formatted_address:", results[0].formatted_address)

                addressText.innerHTML = "Address: " + results[0].formatted_address;

            } else {
                window.alert("No results found");
            }
        } else {
            window.alert("Geocoder failed due to: " + status);
        }
    });

}