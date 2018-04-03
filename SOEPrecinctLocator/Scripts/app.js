/// <reference path="map.ts" />
/// <reference path="xhr.ts" />
var PrecinctLocator;
(function (PrecinctLocator) {
    function IsInteger(value) {
        return typeof value === 'number' &&
            isFinite(value) &&
            Math.floor(value) === value;
    }
    ;
    function Start() {
        PrecinctLocator.mapController = new PrecinctLocator.MapController("map");
        CheckGeolocation();
        document.getElementById("houseNumber").focus();
    }
    PrecinctLocator.Start = Start;
    function CheckGeolocation() {
        var b = document.getElementById("UseLocation");
        if ("geolocation" in navigator) {
            // let's show the get location button.
            b.style.visibility = "visible";
            b.disabled = false;
        }
        else {
            b.disabled = true;
            b.style.visibility = "hidden";
        }
    }
    function GetLocation() {
        // Here we need to get a point and then do something with that point.
        navigator.geolocation.getCurrentPosition(function (p) {
            console.log(p);
        });
    }
    PrecinctLocator.GetLocation = GetLocation;
    function Search(e) {
        e.preventDefault();
        if (!ValidateStreetName() || !ValidateHouseNumber())
            return false;
        return true;
    }
    PrecinctLocator.Search = Search;
    function ValidateStreetName() {
        var streetName = document.getElementById("streetName");
        var streetNameError = document.getElementById("streetNameError");
        streetName.value = streetName.value.trim();
        var isError = streetName.value.length < 3;
        if (isError) {
            streetNameError.style.display = "block";
            streetName.classList.add("is-danger");
        }
        else {
            streetNameError.style.display = "none";
            streetName.classList.remove("is-danger");
        }
        return isError;
    }
    PrecinctLocator.ValidateStreetName = ValidateStreetName;
    function ValidateHouseNumber() {
        var houseNumber = document.getElementById("houseNumber");
        var houseNumberError = document.getElementById("houseNumberError");
        houseNumber.value = houseNumber.value.trim();
        var isError = houseNumber.value.length === 0 || !IsInteger(parseInt(houseNumber.value));
        if (isError) {
            houseNumberError.style.display = "block";
            houseNumber.classList.add("is-danger");
        }
        else {
            houseNumberError.style.display = "none";
            houseNumber.classList.remove("is-danger");
        }
        return isError;
    }
    PrecinctLocator.ValidateHouseNumber = ValidateHouseNumber;
})(PrecinctLocator || (PrecinctLocator = {}));
//# sourceMappingURL=app.js.map