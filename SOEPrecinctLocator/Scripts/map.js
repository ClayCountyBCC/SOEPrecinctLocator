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
                mapController.LocationLayer = new esri.layers.GraphicsLayer();
                mapController.map.addLayers([SOELayer, mapController.LocationLayer]);
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
        MapController.prototype.SetExtent = function (Precinct) {
            var mapController = this;
            var m = this.map;
            require([
                "esri/geometry/Extent",
                "esri/SpatialReference"
            ], function (Extent, SpatialReference) {
                var e = new Extent();
                e.xmax = Precinct.ExtentMax.Longitude;
                e.ymax = Precinct.ExtentMax.Latitude;
                e.xmin = Precinct.ExtentMin.Longitude;
                e.ymin = Precinct.ExtentMin.Latitude;
                e.spatialReference = new SpatialReference(4326);
                m.setExtent(e, true);
            });
        };
        MapController.prototype.Zoom = function (p, Address) {
            var mapController = this;
            var m = this.map;
            var ll = this.LocationLayer;
            require(["esri/geometry/Point",
                "esri/symbols/PictureMarkerSymbol",
                "esri/graphic",
                "esri/SpatialReference",
                "esri/symbols/TextSymbol",
                "esri/Color"], function (Point, PictureMarkerSymbol, Graphic, SpatialReference, TextSymbol, Color) {
                var symbol = new PictureMarkerSymbol({
                    "angle": 0,
                    "xoffset": 0,
                    "yoffset": 0,
                    "type": "esriPMS",
                    "contentType": "image/png",
                    "width": 20,
                    "height": 20,
                    "url": "http://static.arcgis.com/images/Symbols/Basic/GreenSphere.png"
                });
                var textSymbol = new TextSymbol(Address); //esri.symbol.TextSymbol(data.Records[i].UnitName);
                textSymbol.setColor(new Color([0, 0, 0]));
                textSymbol.setAlign(TextSymbol.ALIGN_MIDDLE);
                textSymbol.setOffset(0, -50);
                textSymbol.setHaloColor(new Color([255, 255, 255]));
                textSymbol.setHaloSize(3);
                ll.clear();
                var pt = new Point([p.Longitude, p.Latitude]);
                //var p = new Point([latlong.OriginalX, latlong.OriginalY], new SpatialReference({ wkid: 4326 }));
                //var wmIncident = esri.geometry.geographicToWebMercator(p);
                //var graphic = new Graphic(wmIncident);
                var font = new esri.symbol.Font();
                font.setSize("14pt");
                font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
                textSymbol.setFont(font);
                var graphic = new Graphic(pt);
                graphic.setSymbol(symbol);
                var s = new Graphic(pt);
                s.setSymbol(textSymbol);
                ll.add(graphic);
                ll.add(s);
                m.centerAndZoom(pt, 16);
            });
        };
        return MapController;
    }());
    PrecinctLocator.MapController = MapController;
})(PrecinctLocator || (PrecinctLocator = {}));
//# sourceMappingURL=map.js.map