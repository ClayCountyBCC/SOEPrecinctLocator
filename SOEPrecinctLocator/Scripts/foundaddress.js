/// <reference path="app.ts" />
/// <reference path="point.ts" />
var PrecinctLocator;
(function (PrecinctLocator) {
    var FoundAddress = /** @class */ (function () {
        function FoundAddress() {
            this.WholeAddress = "";
            this.City = "";
            this.Zip = "";
            this.Locations = [];
        }
        FoundAddress.Load = function (fa) {
            PrecinctLocator.mapController.GetLocations(fa);
        };
        FoundAddress.Finish = function (fa) {
            FoundAddress.BuildResults(fa);
            if (fa.length > 0) {
                var results = document.getElementById("Results");
                window.scrollTo(0, results.offsetTop);
                PrecinctLocator.mapController.Zoom(fa[0]);
            }
        };
        FoundAddress.BuildResults = function (fa) {
            var results = document.getElementById("Results");
            PrecinctLocator.clearElement(results);
            var df = document.createDocumentFragment();
            for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
                var a = fa_1[_i];
                var container = document.createElement("div");
                var location_1 = document.createElement("div");
                var results_1 = document.createElement("div");
                container.classList.add("columns");
                location_1.classList.add("column");
                location_1.classList.add("is-one-third");
                var level = document.createElement("div");
                level.classList.add("level");
                level.style.height = "100%";
                location_1.appendChild(level);
                var levelItem = document.createElement("div");
                level.appendChild(levelItem);
                var title = document.createElement("h3");
                title.classList.add("title");
                title.classList.add("is-3");
                levelItem.appendChild(title);
                if (a.City.length > 0) {
                    title.appendChild(document.createTextNode(a.WholeAddress + " " + a.City + ", " + a.Zip));
                }
                else {
                    title.appendChild(document.createTextNode(a.WholeAddress));
                }
                results_1.classList.add("column");
                results_1.classList.add("is-two-thirds");
                results_1.appendChild(FoundAddress.CreateDistrictsTable(a));
                container.appendChild(location_1);
                container.appendChild(results_1);
                df.appendChild(container);
            }
            //let table = document.createElement("table");
            //table.classList.add("table");
            //table.classList.add("is-fullwidth");
            //df.appendChild(table);
            //table.appendChild(FoundAddress.BuildResultsHeaderRow());
            //let tbody = document.createElement("tbody");
            //table.appendChild(tbody);
            //if (fa.length === 0)
            //{
            //  tbody.appendChild(FoundAddress.BuildResultsErrorRow());
            //}
            //else
            //{
            //  for (let a of fa)
            //  {
            //    tbody.appendChild(FoundAddress.BuildResultsRow(a));
            //  }
            //}
            results.appendChild(df);
        };
        FoundAddress.BuildResultsRow = function (fa) {
            var tr = document.createElement("tr");
            if (fa.City.length > 0) {
                tr.appendChild(PrecinctLocator.CreateTableColumn(fa.WholeAddress + " " + fa.City + ", " + fa.Zip, "td"));
            }
            else {
                tr.appendChild(PrecinctLocator.CreateTableColumn(fa.WholeAddress, "td"));
            }
            var td = document.createElement("td");
            td.appendChild(FoundAddress.CreateDistrictsTable(fa));
            tr.appendChild(td);
            return tr;
        };
        FoundAddress.CreateDistrictsTable = function (fa) {
            console.log('creating table');
            var table = document.createElement("table");
            table.classList.add("table");
            table.classList.add("is-fullwidth");
            table.appendChild(FoundAddress.BuildDistrictsHeaderRow());
            var tbody = document.createElement("tbody");
            table.appendChild(tbody);
            for (var _i = 0, _a = fa.Locations; _i < _a.length; _i++) {
                var l = _a[_i];
                tbody.appendChild(FoundAddress.BuildDistrictsTableRow(l));
            }
            return table;
        };
        FoundAddress.BuildDistrictsHeaderRow = function () {
            var thead = document.createElement("thead");
            var tr = document.createElement("tr");
            thead.appendChild(tr);
            tr.appendChild(PrecinctLocator.CreateTableColumn("Type", "TH", "30%"));
            tr.appendChild(PrecinctLocator.CreateTableColumn("District", "TH", "30%"));
            tr.appendChild(PrecinctLocator.CreateTableColumn("", "TH", "30%"));
            tr.appendChild(PrecinctLocator.CreateTableColumn("", "TH", "10%"));
            return thead;
        };
        FoundAddress.BuildDistrictsTableRow = function (l) {
            var tr = document.createElement("tr");
            tr.appendChild(PrecinctLocator.CreateTableColumn(l.label, "TD"));
            tr.appendChild(PrecinctLocator.CreateTableColumn(l.value, "TD"));
            tr.appendChild(PrecinctLocator.CreateTableColumn(l.extra, "TD"));
            tr.appendChild(FoundAddress.CreateDistrictsTableButton(l));
            return tr;
        };
        FoundAddress.BuildResultsErrorRow = function () {
            var tr = document.createElement("tr");
            tr.appendChild(PrecinctLocator.CreateTableColumn("This address was not found.", "", "td"));
            tr.appendChild(PrecinctLocator.CreateTableColumn("", "", "td"));
            return tr;
        };
        FoundAddress.BuildResultsHeaderRow = function () {
            var thead = document.createElement("thead");
            var tr = document.createElement("tr");
            thead.appendChild(tr);
            tr.appendChild(PrecinctLocator.CreateTableColumn("Address", "TH", "40%"));
            tr.appendChild(PrecinctLocator.CreateTableColumn("Districts", "TH", "60%"));
            return thead;
        };
        FoundAddress.CreateDistrictsTableButton = function (l) {
            var td = document.createElement("td");
            var add = document.createElement("button");
            add.type = "button";
            add.classList.add("button");
            add.classList.add("is-primary");
            add.appendChild(document.createTextNode("View on Map"));
            if (l === null || l.shape === null) {
                add.disabled = true;
            }
            else {
                add.onclick = function () {
                    var results = document.getElementById("Results");
                    window.scrollTo(0, results.offsetTop);
                    PrecinctLocator.mapController.SetExtent(l);
                };
            }
            td.appendChild(add);
            return td;
        };
        return FoundAddress;
    }());
    PrecinctLocator.FoundAddress = FoundAddress;
})(PrecinctLocator || (PrecinctLocator = {}));
//# sourceMappingURL=foundaddress.js.map