/// <reference path="map.ts" />
/// <reference path="xhr.ts" />
/// <reference path="precinct.ts" />
/// <reference path="foundaddress.ts" />
var PrecinctLocator;
(function (PrecinctLocator) {
    PrecinctLocator.Precincts = [];
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
        GetPrecincts();
    }
    PrecinctLocator.Start = Start;
    function CheckGeolocation() {
        var b = document.getElementById("LocationButton");
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
        HandleSearchElements("", "is-loading", true);
        navigator.geolocation.getCurrentPosition(function (p) {
            var pointToUse = new PrecinctLocator.Point();
            pointToUse.Latitude = p.coords.latitude;
            pointToUse.Longitude = p.coords.longitude;
            pointToUse.IsValid = true;
            var fa = new PrecinctLocator.FoundAddress();
            fa.AddressPoint = pointToUse;
            fa.WholeAddress = "Current Location";
            PrecinctLocator.FoundAddress.Load([fa]);
            HandleSearchElements("", "is-loading", false);
        }, function (e) {
            HandleSearchElements("", "is-loading", false);
        });
    }
    PrecinctLocator.GetLocation = GetLocation;
    function View(id) {
        var byAddress = document.getElementById("ByAddress");
        var navByAddress = document.getElementById("navByAddress");
        var Results = document.getElementById("Results");
        var byPrecinct = document.getElementById("ByPrecinct");
        var navByPrecinct = document.getElementById("navByPrecinct");
        var Print = document.getElementById("Print");
        var navPrint = document.getElementById("navPrint");
        // first let's set everything to hidden;
        navByAddress.classList.remove("is-active");
        navByPrecinct.classList.remove("is-active");
        navPrint.classList.remove("is-active");
        byAddress.style.display = "none"; // byAddress and Results should be shown/hidden as a pair.
        Results.style.display = "none";
        byPrecinct.style.display = "none";
        Print.style.display = "none";
        switch (id) {
            case "ByAddress":
                navByAddress.classList.add("is-active");
                byAddress.style.display = "block";
                Results.style.display = "block";
                break;
            case "Print":
                navPrint.classList.add("is-active");
                Print.style.display = "block";
                break;
            case "ByPrecinct":
                navByPrecinct.classList.add("is-active");
                byPrecinct.style.display = "block";
                break;
        }
    }
    PrecinctLocator.View = View;
    function Search() {
        if (ValidateStreetName() || ValidateHouseNumber()) {
            return false;
        }
        HandleSearchElements("is-loading", "", true);
        PostSearch()
            .then(function (foundAddresses) {
            console.log('found addresses', foundAddresses);
            PrecinctLocator.FoundAddress.Load(foundAddresses);
            HandleSearchElements("is-loading", "", false);
            return true;
        })
            .catch(function (response) {
            // fail
            console.log('failed to find addresses', response);
            HandleSearchElements("is-loading", "", false);
            return false;
        });
        return true;
    }
    PrecinctLocator.Search = Search;
    function BuildPrecincts(pl) {
        var Precincts = document.getElementById("ByPrecinct");
        clearElement(Precincts);
        var df = document.createDocumentFragment();
        var table = document.createElement("table");
        table.classList.add("table");
        df.appendChild(table);
        table.appendChild(BuildPrecinctsHeaderRow());
        var tbody = document.createElement("tbody");
        table.appendChild(tbody);
        if (pl.length === 0) {
            tbody.appendChild(BuildPrecinctsErrorRow());
        }
        else {
            for (var _i = 0, pl_1 = pl; _i < pl_1.length; _i++) {
                var p = pl_1[_i];
                tbody.appendChild(BuildPrecinctsRow(p));
            }
        }
        Precincts.appendChild(df);
    }
    function BuildPrecinctsRow(p) {
        var tr = document.createElement("tr");
        tr.appendChild(CreateTableColumn(p.Id, "td"));
        tr.appendChild(CreateTableColumn(p.Name, "td"));
        tr.appendChild(CreateTableColumn(p.Address, "td"));
        tr.appendChild(CreateTableColumn(p.Comment, "td"));
        tr.appendChild(CreatePrecinctsTableButton(p, "View on Map"));
        return tr;
    }
    function BuildPrecinctsErrorRow() {
        var tr = document.createElement("tr");
        tr.appendChild(CreateTableColumn("", "10%", "td"));
        tr.appendChild(CreateTableColumn("", "20%", "td"));
        tr.appendChild(CreateTableColumn("There was a problem retrieving the Precinct Information.", "", "td"));
        tr.appendChild(CreateTableColumn("", "25%", "td"));
        tr.appendChild(CreatePrecinctsTableButton(null, "View on Map"));
        return tr;
    }
    function BuildPrecinctsHeaderRow() {
        var thead = document.createElement("thead");
        var tr = document.createElement("tr");
        thead.appendChild(tr);
        tr.appendChild(CreateTableColumn("Precinct #", "TH", "15%"));
        tr.appendChild(CreateTableColumn("Name", "TH", "20%"));
        tr.appendChild(CreateTableColumn("Address", "TH", "30%"));
        tr.appendChild(CreateTableColumn("Comment", "TH", "25%"));
        tr.appendChild(CreateTableColumn("", "TH", "10%"));
        return thead;
    }
    function CreateTableColumn(value, colTag, width) {
        if (width === void 0) { width = ""; }
        var d = document.createElement(colTag);
        if (width.length > 0)
            d.style.width = width;
        d.appendChild(document.createTextNode(value));
        return d;
    }
    PrecinctLocator.CreateTableColumn = CreateTableColumn;
    function CreatePrecinctsTableButton(p, label) {
        var td = document.createElement("td");
        var add = document.createElement("button");
        add.type = "button";
        add.classList.add("button");
        add.classList.add("is-primary");
        add.appendChild(document.createTextNode(label));
        if (p === null) {
            add.disabled = true;
        }
        else {
            add.onclick = function () {
                document.getElementById('map').scrollIntoView();
                //mapController.SetExtent(p);
                RemovePreviousSelections(td.parentElement);
                add.classList.add("is-inverted");
                td.parentElement.classList.add("is-selected");
            };
        }
        td.appendChild(add);
        return td;
    }
    function RemovePreviousSelections(tr) {
        RemoveClass("#ByPrecinct table tr.is-selected", "is-selected");
        RemoveClass("#ByPrecinct table tr button.is-inverted", "is-inverted");
    }
    function RemoveClass(query, classToRemove) {
        var qs = document.querySelectorAll(query);
        if (qs.length > 0) {
            for (var i = 0; i < qs.length; i++) {
                qs.item(i).classList.remove(classToRemove);
            }
        }
    }
    function HandleSearchElements(searchButtonClass, locationButtonClass, Add) {
        var SearchButton = document.getElementById("SearchButton");
        var LocationButton = document.getElementById("LocationButton");
        if (searchButtonClass.length > 0)
            Add ? SearchButton.classList.add(searchButtonClass) : SearchButton.classList.remove(searchButtonClass);
        if (locationButtonClass.length > 0)
            Add ? LocationButton.classList.add(locationButtonClass) : LocationButton.classList.remove(locationButtonClass);
        SearchButton.disabled = Add;
        LocationButton.disabled = Add;
    }
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
        console.log('ValidateStreetName', isError);
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
        console.log('ValidateHouseNumber', isError);
        return isError;
    }
    PrecinctLocator.ValidateHouseNumber = ValidateHouseNumber;
    function GetPrecincts() {
        var p = new PrecinctLocator.Precinct();
        p.GetPrecincts()
            .then(function (precincts) {
            console.log('Precincts Returned', precincts);
            PrecinctLocator.Precincts = precincts;
            BuildPrecincts(precincts);
        }, function () {
            console.log('error getting precincts');
            PrecinctLocator.Precincts = [];
        });
    }
    function PostSearch() {
        var houseNumber = document.getElementById("houseNumber");
        var streetName = document.getElementById("streetName");
        var SearchAddress = {
            house: parseInt(houseNumber.value),
            street: streetName.value.toUpperCase()
        };
        var x = XHR.Post("API/Precinct", JSON.stringify(SearchAddress));
        return new Promise(function (resolve, reject) {
            x.then(function (response) {
                var ar = JSON.parse(response.Text);
                return resolve(ar);
            }).catch(function () {
                console.log("error in Get Precincts");
                return reject(null);
            });
        });
    }
    function clearElement(node) {
        if (node === undefined || node === null)
            return;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
    PrecinctLocator.clearElement = clearElement;
})(PrecinctLocator || (PrecinctLocator = {}));
//# sourceMappingURL=app.js.map