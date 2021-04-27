// Define the html elements
var coordsNumbers = document.getElementById("coordsNumbers");
var addressText = document.getElementById("addressText");
var mapElement = document.getElementById("googleMapSection");
// Define the html elements end

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
    console.log("initMap");

}


function displayOnMap(_coords) {

    const _latitude = (_coords && _coords.latitude) ? _coords.latitude : 43.642567
    const _longitude = (_coords && _coords.longitude) ? _coords.longitude : -79.387054

    const myLatLng = {
        lat: _latitude,
        lng: _longitude
    };

    const map = new google.maps.Map(mapElement, {
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


function getLocationFromAddress() {
    console.log("getLocationFromAddress");
    const address = document.getElementById("address").value;
    geocodeAddress(address);
}

function geocodeAddress(_address) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        address: _address
    }, (results, status) => {
        if (status === "OK") {

            const _location = {
                latitude: results[0].geometry.location.lat(),
                longitude: results[0].geometry.location.lng(),
            }
            console.log("_location:", _location);
            displayOnMap(_location)
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