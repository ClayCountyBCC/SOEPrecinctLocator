/// <reference path="xhr.ts" />
/// <reference path="app.ts" />
var PrecinctLocator;
(function (PrecinctLocator) {
    var Precinct = /** @class */ (function () {
        function Precinct() {
        }
        Precinct.prototype.GetPrecincts = function () {
            var x = XHR.Get("API/Precinct");
            return new Promise(function (resolve, reject) {
                x.then(function (response) {
                    var ar = JSON.parse(response.Text);
                    return resolve(ar);
                }).catch(function () {
                    console.log("error in Get Precincts");
                    return reject(null);
                });
            });
        };
        return Precinct;
    }());
    PrecinctLocator.Precinct = Precinct;
})(PrecinctLocator || (PrecinctLocator = {}));
//# sourceMappingURL=precinct.js.map