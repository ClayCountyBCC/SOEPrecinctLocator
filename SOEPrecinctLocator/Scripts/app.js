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
        SearchStart("", "is-loading");
        navigator.geolocation.getCurrentPosition(function (p) {
            var PointToUse = {
                Latitude: p.coords.latitude,
                Longitude: p.coords.longitude
            };
            document.getElementById('map').scrollIntoView();
            PrecinctLocator.mapController.Zoom(PointToUse, null, "");
            SearchEnd("", "is-loading");
        }, function (e) {
            SearchEnd("", "is-loading");
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
        SearchStart("is-loading", "");
        PostSearch()
            .then(function (foundAddresses) {
            BuildResults(foundAddresses);
            if (foundAddresses.length === 1) {
                var results = document.getElementById("Results");
                window.scrollTo(0, results.offsetTop);
                var fa = foundAddresses[0];
                PrecinctLocator.mapController.Zoom(fa.AddressPoint, GetPrecinctFromAddress(fa), fa.WholeAddress);
            }
            SearchEnd("is-loading", "");
            return true;
        })
            .catch(function () {
            // fail
            console.log('failed to find addresses');
            SearchEnd("is-loading", "");
            return false;
        });
        return true;
    }
    PrecinctLocator.Search = Search;
    function GetPrecinctFromAddress(fa) {
        var p = PrecinctLocator.Precincts.filter(function (j) {
            return j.Id === fa.Precinct;
        });
        if (p.length === 0) {
            return null;
        }
        else {
            return p[0];
        }
    }
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
    function BuildResults(fa) {
        var results = document.getElementById("Results");
        clearElement(results);
        var df = document.createDocumentFragment();
        var table = document.createElement("table");
        table.classList.add("table");
        df.appendChild(table);
        table.appendChild(BuildResultsHeaderRow());
        var tbody = document.createElement("tbody");
        table.appendChild(tbody);
        if (fa.length === 0) {
            tbody.appendChild(BuildResultsErrorRow());
        }
        else {
            for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
                var a = fa_1[_i];
                tbody.appendChild(BuildResultsRow(a));
            }
        }
        results.appendChild(df);
    }
    function BuildPrecinctsRow(p) {
        var tr = document.createElement("tr");
        tr.appendChild(CreateTableElement(p.Id, "15%", "td"));
        tr.appendChild(CreateTableElement(p.Name, "20%", "td"));
        tr.appendChild(CreateTableElement(p.Address, "30%", "td"));
        tr.appendChild(CreateTableElement(p.Comment, "30%", "td"));
        tr.appendChild(CreatePrecinctsTableButton(p, "View on Map", "10%"));
        return tr;
    }
    function BuildPrecinctsErrorRow() {
        var tr = document.createElement("tr");
        tr.appendChild(CreateTableElement("", "10%", "td"));
        tr.appendChild(CreateTableElement("", "20%", "td"));
        tr.appendChild(CreateTableElement("There was a problem retrieving the Precinct Information.", "", "td"));
        tr.appendChild(CreateTableElement("", "25%", "td"));
        tr.appendChild(CreatePrecinctsTableButton(null, "View on Map", "10%"));
        return tr;
    }
    function BuildResultsRow(fa) {
        var tr = document.createElement("tr");
        tr.appendChild(CreateTableElement(fa.WholeAddress + " " + fa.City + ", " + fa.Zip, "40%", "td"));
        tr.appendChild(CreateTableElement(fa.Precinct, "15%", "td"));
        var p = GetPrecinctFromAddress(fa);
        if (p === null) {
            tr.appendChild(CreateTableElement("", "35%", "td"));
        }
        else {
            tr.appendChild(CreateTableElement(p.Name, "35%", "td"));
        }
        tr.appendChild(CreateResultsTableButton(fa.AddressPoint, p, fa.WholeAddress, "10%"));
        return tr;
    }
    function BuildResultsErrorRow() {
        var tr = document.createElement("tr");
        tr.appendChild(CreateTableElement("This address was not found.", "", "td"));
        tr.appendChild(CreateTableElement("", "", "td"));
        tr.appendChild(CreateTableElement("", "", "td"));
        var disabledButton = CreateResultsTableButton(null, null, "", "");
        tr.appendChild(disabledButton);
        return tr;
    }
    function BuildPrecinctsHeaderRow() {
        var thead = document.createElement("thead");
        var tr = document.createElement("tr");
        thead.appendChild(tr);
        tr.appendChild(CreateTableElement("Precinct #", "15%", "TH"));
        tr.appendChild(CreateTableElement("Name", "20%", "TH"));
        tr.appendChild(CreateTableElement("Address", "30%", "TH"));
        tr.appendChild(CreateTableElement("Comment", "25%", "TH"));
        tr.appendChild(CreateTableElement("", "10%", "TH"));
        return thead;
    }
    function BuildResultsHeaderRow() {
        var thead = document.createElement("thead");
        var tr = document.createElement("tr");
        thead.appendChild(tr);
        tr.appendChild(CreateTableElement("Address", "40%", "TH"));
        tr.appendChild(CreateTableElement("Precinct #", "15%", "TH"));
        tr.appendChild(CreateTableElement("Precinct Info", "35%", "TH"));
        tr.appendChild(CreateTableElement("", "10%", "TH"));
        return thead;
    }
    function CreateTableElement(value, width, colTag) {
        var d = document.createElement(colTag);
        if (width.length > 0)
            d.style.width = width;
        d.appendChild(document.createTextNode(value));
        return d;
    }
    function CreateResultsTableButton(point, Precinct, Address, width) {
        var td = document.createElement("td");
        td.style.width = width;
        var add = document.createElement("button");
        add.type = "button";
        add.classList.add("button");
        add.classList.add("is-primary");
        add.appendChild(document.createTextNode("View on Map"));
        if (point === null) {
            add.disabled = true;
        }
        else {
            add.onclick = function () {
                var results = document.getElementById("Results");
                window.scrollTo(0, results.offsetTop);
                PrecinctLocator.mapController.Zoom(point, Precinct, Address);
            };
        }
        td.appendChild(add);
        return td;
    }
    function CreatePrecinctsTableButton(p, label, width) {
        var td = document.createElement("td");
        td.style.width = width;
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
                PrecinctLocator.mapController.SetExtent(p);
            };
        }
        td.appendChild(add);
        return td;
    }
    function SearchStart(searchButtonClass, locationButtonClass) {
        var SearchButton = document.getElementById("SearchButton");
        var LocationButton = document.getElementById("LocationButton");
        if (searchButtonClass.length > 0)
            SearchButton.classList.add(searchButtonClass);
        if (locationButtonClass.length > 0)
            LocationButton.classList.add(locationButtonClass);
        SearchButton.disabled = true;
        LocationButton.disabled = true;
    }
    function SearchEnd(searchButtonClass, locationButtonClass) {
        var SearchButton = document.getElementById("SearchButton");
        var LocationButton = document.getElementById("LocationButton");
        if (searchButtonClass.length > 0)
            SearchButton.classList.remove(searchButtonClass);
        if (locationButtonClass.length > 0)
            LocationButton.classList.remove(locationButtonClass);
        SearchButton.disabled = false;
        LocationButton.disabled = false;
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