// Define the elements and global parameters
var coordsNumbers = document.getElementById("coordsNumbers");
var addressText = document.getElementById("addressText");
var mapElement = document.getElementById("googleMapSection");
var realTimeElement = document.getElementById("realTimeElement");
var autoLocateSection = document.getElementById("auto-locate-section");
var inputAddressSection = document.getElementById("input-address-section");
var infoSection = document.getElementById("info-section");
var loadingSection = document.getElementById("loading-section");

var submitButton = document.getElementById("address");
var googleApikey = 'AIzaSyAdKvswD4AjeyYWt7WseQjQ35w5DX2ZAfY';
var _latitude = null;
var _longitude = null;
var offsets = null;
// Define the html elements and global parameters end
// Define functions
var vm = this;
vm.selectOpt = selectOpt;
vm.getLocation = getLocation;
vm.showPosition = showPosition;
vm.getInfoSectionData = getInfoSectionData;
vm.displayCoordText = displayCoordText;
vm.displayOnMap = displayOnMap;
vm.getLocationFromAddress = getLocationFromAddress;
vm.geocodeAddress = geocodeAddress;
vm.getAddressText = getAddressText;
vm.initInfoSection = initInfoSection;
vm.getRealTime = getRealTime;
vm.getTimeRuning = getTimeRuning;
// Define functions
// ====================================================================================

selectOpt();

function selectOpt(_opt) {
    initInfoSection();

    switch (_opt) {
        case 'optAutoRadio':

            inputAddressSection.style.display = "none";
            autoLocateSection.style.display = "inline";

            break;
        case 'optInputRadio':
            inputAddressSection.style.display = "inline";
            autoLocateSection.style.display = "none";

            break;

        default:
            inputAddressSection.style.display = "none";
            autoLocateSection.style.display = "none";
            break;
    }
}

function getLocation() {
    loadingSection.style.display = "inline";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition); //Get current positon and display 
    } else {
        coordsNumbers.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {

    _latitude = position.coords.latitude;
    _longitude = position.coords.longitude;
    getInfoSectionData();
}

function getInfoSectionData() {
    displayOnMap();
    displayCoordText();
    getAddressText();
}

function displayCoordText() {
    coordsNumbers.innerHTML = "Latitude: " + _latitude +
        "<br>Longitude: " + _longitude;
}


function displayOnMap() {
    infoSection.style.display = "inline";
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
        map
    });

    inputAddressSection.style.display = "none";
    autoLocateSection.style.display = "none";

    const _timeZoneLoc = _latitude + "," + _longitude;
    getRealTime(_timeZoneLoc);
}

function getLocationFromAddress() {
    loadingSection.style.display = "inline";
    const address = submitButton.value;
    setTimeout(() => geocodeAddress(address), 500);
}

function geocodeAddress(_address) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        address: _address
    }, (results, status) => {
        if (status === "OK") {
            _latitude = results[0].geometry.location.lat();
            _longitude = results[0].geometry.location.lng();

            getInfoSectionData();
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

function getAddressText() {
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
                addressText.innerHTML = "Address: " + results[0].formatted_address;

            } else {
                window.alert("No results found");
            }
        } else {
            window.alert("Geocoder failed due to: " + status);
        }
    });

}

function initInfoSection() {
    loadingSection.style.display = "none";
    clearInterval(getTimeRuning);
    infoSection.style.display = "none";
    addressText.innerHTML = null;
    coordsNumbers.innerHTML = null;
    realTimeElement.innerHTML = null;
    // _latitude = null;
    // _longitude = null;
    // offsets = null;
}

function getRealTime(_loc) {

    var targetDate = new Date()
    var timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60 // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
    var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + _loc + '&timestamp=' + timestamp + '&key=' + googleApikey;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', apicall)
    xhr.onload = function () {
        if (xhr.status === 200) {
            var output = JSON.parse(xhr.responseText)
            if (output.status == 'OK') {
                offsets = output.dstOffset * 1000 + output.rawOffset * 1000
                loadingSection.style.display = "none";
                setInterval(() => getTimeRuning(), 1000);
            }
        } else {
            alert('Request failed.  Returned status of ' + xhr.status)
        }
    }
    xhr.send();


}

function getTimeRuning() {

    var targetDate = new Date()
    var timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;
    var localdate = new Date(timestamp * 1000 + offsets) //
    realTimeElement.innerHTML = "The Curret Time for this location: " + localdate.toLocaleString();
}