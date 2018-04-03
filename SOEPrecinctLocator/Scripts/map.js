/// <reference path="Typings/arcgis-js-api.d.ts" />
var PrecinctLocator;
(function (PrecinctLocator) {
    var MapController = /** @class */ (function () {
        function MapController(mapDiv) {
            this.mapDiv = mapDiv;
            this.isDrawing = false;
            var mapController = this;
            require([
                "esri/map",
                "esri/layers/ArcGISDynamicMapServiceLayer",
                "esri/dijit/BasemapToggle",
                "dojo/_base/array",
                "dojo/parser",
                "dijit/layout/BorderContainer",
                "esri/toolbars/draw",
                "dojo/domReady!"
            ], function (Map, ArcGISDynamicMapServiceLayer, BasemapToggle, arrayUtils, Parser, BorderContainer, Draw) {
                var mapOptions = {
                    basemap: "streets",
                    smartNavigation: false,
                    zoom: 11,
                    logo: false,
                    center: [-81.80, 29.950]
                    //showInfoWindowOnClick: false
                };
                mapController.map = new Map(mapDiv, mapOptions);
                var toggle = new BasemapToggle({
                    map: mapController.map,
                    basemap: "satellite" //hybrid
                }, "BaseMapToggle");
                toggle.startup();
                //mapController.map.on("load", function (evt)
                //{
                //  IView.mapLoadCompleted();
                //});
                //let dynamicLayerOptions = {
                //  opacity: .3
                //};
                var SOELayer = new ArcGISDynamicMapServiceLayer("https://maps.claycountygov.com:6443/arcgis/rest/services/SOE/MapServer"); //, dynamicLayerOptions);
                var LocationLayer = new esri.layers.GraphicsLayer();
                mapController.map.addLayers([SOELayer, LocationLayer]);
            });
        }
        MapController.prototype.CenterAndZoom = function (p) {
            var mapController = this;
            var m = this.map;
            require(["esri/geometry/Point"], function (Point) {
                var pt = new Point([p.Longitude, p.Latitude]);
                m.centerAndZoom(pt, 18);
            });
        };
        return MapController;
    }());
    PrecinctLocator.MapController = MapController;
})(PrecinctLocator || (PrecinctLocator = {}));
//# sourceMappingURL=map.js.map