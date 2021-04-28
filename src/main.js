// Define the html elements
var coordsNumbers = document.getElementById("coordsNumbers");
var addressText = document.getElementById("addressText");
var mapElement = document.getElementById("googleMapSection");
var timeZoneOffset = document.getElementById("timeZoneOffset");
var submitButton = document.getElementById("address");
// Define the html elements end

var googleApikey = 'AIzaSyAdKvswD4AjeyYWt7WseQjQ35w5DX2ZAfY';
var _latitude = null;
var _longitude = null;
var offsets = null;

function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        coordsNumbers.innerHTML = "Geolocation is not supported by this browser.";
    }
}


function showPosition(position) {

    displayOnMap(position.coords)
    coordsNumbers.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
    getAddress(position.coords)


}

function initMap() {

    console.log("initMap");

}


function displayOnMap(_coords) {
    initInfoSection();
    _latitude = (_coords && _coords.latitude) ? _coords.latitude : 43.642567
    _longitude = (_coords && _coords.longitude) ? _coords.longitude : -79.387054

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

    const _timeZoneLoc = _latitude + "," + _longitude;

    getTimeZone(_timeZoneLoc);
}

// geocoding address 


function getLocationFromAddress() {
    console.log("getLocationFromAddress");
    const address = submitButton.value;
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
            // console.log("_location:", _location);
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
                // console.log("results[0].formatted_address:", results[0].formatted_address)

                addressText.innerHTML = "Address: " + results[0].formatted_address;

            } else {
                window.alert("No results found");
            }
        } else {
            window.alert("Geocoder failed due to: " + status);
        }
    });

}

function initInfoSection(_loc) {
    // todo : init all and renew
    addressText.innerHTML = null;
    coordsNumbers.innerHTML = null;
}

function getTimeZone(_loc) {

    var targetDate = new Date()
    var timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60 // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
    var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + _loc + '&timestamp=' + timestamp + '&key=' + googleApikey

    var xhr = new XMLHttpRequest() // create new XMLHttpRequest2 object
    xhr.open('GET', apicall) // open GET request
    xhr.onload = function () {
        if (xhr.status === 200) { // if Ajax request successful
            var output = JSON.parse(xhr.responseText) // convert returned JSON string to JSON object
            console.log(output.status) // log API return status for debugging purposes
            if (output.status == 'OK') { // if API reports everything was returned successfully
                offsets = output.dstOffset * 1000 + output.rawOffset * 1000 // get DST and time zone offsets in milliseconds
                var localdate = new Date(timestamp * 1000 + offsets) // Date object containing current time of Tokyo (timestamp + dstOffset + rawOffset)
                console.log("getTimeZone:", localdate.toLocaleString()) // Display current Tokyo date and time
                timeZoneOffset.innerHTML = "The Curret Time for this location: " + localdate.toLocaleString();

                setInterval(() => startTime(), 1000);
            }
        } else {
            alert('Request failed.  Returned status of ' + xhr.status)
        }
    }
    xhr.send();


}

function startTime() {

    console.log("startTime")
    var targetDate = new Date()
    var timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;
    var localdate = new Date(timestamp * 1000 + offsets) //
    timeZoneOffset.innerHTML = "The Curret Time for this location: " + localdate.toLocaleString();
}