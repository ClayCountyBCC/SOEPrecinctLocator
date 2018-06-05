/// <reference path="Typings/arcgis-js-api.d.ts" />
/// <reference path="location.ts" />
var PrecinctLocator;
(function (PrecinctLocator) {
    var MapController = /** @class */ (function () {
        function MapController(mapDiv) {
            this.mapDiv = mapDiv;
            this.PrecinctLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/VotingPrecinct/MapServer";
            this.PrecinctBoundaryLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/VotingPrecinct/MapServer/1";
            this.CommissionerDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/CommissionerDistrict/MapServer/0";
            this.HouseDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/FL_HouseDist/MapServer/0";
            this.SenateDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/FL_SenateDist/MapServer/0";
            this.SchoolBoardDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/SchoolBoardDist/MapServer/0";
            this.MunicipalBoundaryLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/MunicipalBoundary/MapServer/0";
            this.CommunityDevDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/CDD/MapServer/0";
            this.LAMSBDLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/LAMSBD/MapServer/0";
            this.Layers = [];
            var mapController = this;
            require([
                "esri/map",
                "esri/symbols/SimpleFillSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/renderers/SimpleRenderer",
                "esri/graphic",
                "esri/lang",
                "esri/Color",
                "esri/layers/ArcGISDynamicMapServiceLayer",
                "esri/layers/FeatureLayer",
                "esri/dijit/BasemapToggle",
                "dojo/_base/array",
                "dojo/parser",
                "dijit/layout/BorderContainer",
                "esri/toolbars/draw",
                "dojo/domReady!"
            ], function (Map, SimpleFillSymbol, SimpleLineSymbol, SimpleRenderer, Graphic, esriLang, Color, ArcGISDynamicMapServiceLayer, FeatureLayer, BasemapToggle, arrayUtils, Parser, BorderContainer, Draw) {
                var mapOptions = {
                    basemap: "streets",
                    smartNavigation: false,
                    zoom: 11,
                    logo: false,
                    center: [-81.80, 29.950]
                };
                mapController.map = new Map(mapDiv, mapOptions);
                var toggle = new BasemapToggle({
                    map: mapController.map,
                    basemap: "satellite" //hybrid
                }, "BaseMapToggle");
                toggle.startup();
                mapController.LocationLayer = new esri.layers.GraphicsLayer();
                mapController.LocationLayer.id = "locationLayer";
                mapController.Layers.push(mapController.LocationLayer);
                mapController.PrecinctLayer = new ArcGISDynamicMapServiceLayer(mapController.PrecinctLayerURL);
                mapController.PrecinctLayer.id = "precinctLocationLayer";
                mapController.Layers.push(mapController.PrecinctLayer);
                mapController.PrecinctBoundaryLayer =
                    new FeatureLayer(mapController.PrecinctBoundaryLayerURL, {
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: ["PRECINCT", "OBJECTID"],
                        id: "precinctBoundaryLayer"
                    });
                mapController.Layers.push(mapController.PrecinctBoundaryLayer);
                var layersVisible = true;
                var opacityValue = 0;
                mapController.CommissionerDistrictLayer =
                    new FeatureLayer(mapController.CommissionerDistrictLayerURL, {
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: ["District", "OBJECTID", "CommissionerName"],
                        visible: layersVisible,
                        opacity: opacityValue,
                        id: "commissionerLayer"
                    });
                mapController.Layers.push(mapController.CommissionerDistrictLayer);
                mapController.HouseDistrictLayer =
                    new FeatureLayer(mapController.HouseDistrictLayerURL, {
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: ["District", "OBJECTID", "NAME"],
                        visible: layersVisible,
                        opacity: opacityValue,
                        id: "houseDistrictLayer"
                    });
                mapController.Layers.push(mapController.HouseDistrictLayer);
                mapController.SenateDistrictLayer =
                    new FeatureLayer(mapController.SenateDistrictLayerURL, {
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: ["District", "OBJECTID", "NAME"],
                        visible: layersVisible,
                        opacity: opacityValue,
                        id: "senateDistrictLayer"
                    });
                mapController.Layers.push(mapController.SenateDistrictLayer);
                mapController.SchoolBoardDistrictLayer =
                    new FeatureLayer(mapController.SchoolBoardDistrictLayerURL, {
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: ["District", "OBJECTID", "Name"],
                        visible: layersVisible,
                        opacity: opacityValue,
                        id: "schoolboardDistrictLayer"
                    });
                mapController.Layers.push(mapController.SchoolBoardDistrictLayer);
                mapController.MunicipalBoundaryLayer =
                    new FeatureLayer(mapController.MunicipalBoundaryLayerURL, {
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: ["Municipality", "OBJECTID"],
                        visible: layersVisible,
                        opacity: opacityValue,
                        id: "municipalLayer"
                    });
                mapController.Layers.push(mapController.MunicipalBoundaryLayer);
                mapController.CommunityDevDistrictLayer =
                    new FeatureLayer(mapController.CommunityDevDistrictLayerURL, {
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: ["Name", "OBJECTID"],
                        visible: layersVisible,
                        opacity: opacityValue,
                        id: "cddLayer"
                    });
                mapController.Layers.push(mapController.CommunityDevDistrictLayer);
                mapController.LAMSBDLayer = new FeatureLayer(mapController.LAMSBDLayerURL, {
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    outFields: ["Name", "OBJECTID"],
                    visible: layersVisible,
                    opacity: opacityValue,
                    id: "lamsbdLayer"
                });
                mapController.Layers.push(mapController.LAMSBDLayer);
                console.log('mapController', mapController);
                //mapController.map.addLayers([mapController.HouseDistrictLayer]);
                mapController.map.addLayers(mapController.Layers);
            });
        }
        MapController.prototype.closeDialog = function () {
            PrecinctLocator.mapController.map.graphics.clear();
        };
        MapController.prototype.CenterAndZoom = function (p) {
            var mapController = this;
            var m = this.map;
            require(["esri/geometry/Point"], function (Point) {
                var pt = new Point([p.Longitude, p.Latitude]);
                m.centerAndZoom(pt, 18);
            });
        };
        MapController.prototype.SetExtent = function (location) {
            var mapController = this;
            var m = this.map;
            require([
                "esri/geometry/Extent",
                "esri/SpatialReference",
                "esri/symbols/SimpleFillSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/graphic",
                "esri/Color"
            ], function (Extent, SpatialReference, SimpleFillSymbol, SimpleLineSymbol, Graphic, Color) {
                var highlightSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 3), new Color([125, 125, 125, 0.15]));
                m.graphics.clear();
                var highlightGraphic = new Graphic(location.shape, highlightSymbol);
                m.graphics.add(highlightGraphic);
                m.setExtent(location.extent, true);
            });
        };
        MapController.prototype.GetLocations = function (foundAddresses) {
            var mapController = this;
            var m = this.map;
            require([
                "esri/geometry/Point",
                "esri/geometry/Polygon",
                "esri/tasks/query"
            ], function (Point, Polygon, Query) {
                var _loop_1 = function (fa) {
                    var pt = new Point([fa.AddressPoint.Longitude, fa.AddressPoint.Latitude]);
                    var query = new Query();
                    query.geometry = pt;
                    for (var _i = 0, _a = mapController.Layers; _i < _a.length; _i++) {
                        var layer = _a[_i];
                        console.log('layer', layer);
                        if (layer.id !== "precinctLocationLayer" && layer.id !== "locationLayer") {
                            layer.queryFeatures(query, function (response) {
                                for (var _i = 0, _a = response.features; _i < _a.length; _i++) {
                                    var feature = _a[_i];
                                    if (feature.geometry.contains(pt)) {
                                        console.log('found point', feature.attributes);
                                    }
                                }
                            }, function (errorResponse) {
                                console.log('an error occurred', errorResponse);
                            });
                        }
                    }
                };
                for (var _i = 0, foundAddresses_1 = foundAddresses; _i < foundAddresses_1.length; _i++) {
                    var fa = foundAddresses_1[_i];
                    _loop_1(fa);
                }
            });
        };
        MapController.prototype.GetLocationsOld = function (foundAddresses) {
            var mapController = this;
            var m = this.map;
            require([
                "esri/geometry/Point",
                "esri/geometry/Polygon"
            ], function (Point, Polygon) {
                // for production
                //var pt = new Point([longitude, latitude]);
                for (var _i = 0, foundAddresses_2 = foundAddresses; _i < foundAddresses_2.length; _i++) {
                    var fa = foundAddresses_2[_i];
                    var pt = new Point([fa.AddressPoint.Longitude, fa.AddressPoint.Latitude]);
                    // for testing
                    //var pt = new Point([-81.77642, 30.11958999]);
                    var found = [];
                    for (var _a = 0, _b = mapController.Layers; _a < _b.length; _a++) {
                        var layer = _b[_a];
                        if (layer.graphics !== null && layer.graphics !== undefined) {
                            for (var _c = 0, _d = layer.graphics; _c < _d.length; _c++) {
                                var g = _d[_c];
                                if (g.geometry.contains(pt)) {
                                    var location_1 = new PrecinctLocator.Location();
                                    location_1.id = layer.id;
                                    location_1.shape = g.geometry;
                                    location_1.extent = g.geometry.getExtent();
                                    switch (layer.id) {
                                        case "precinctBoundaryLayer":
                                            location_1.label = "Precinct";
                                            location_1.value = g.attributes.PRECINCT.toString();
                                            break;
                                        case "commissionerLayer":
                                            location_1.label = "Commissioner District";
                                            location_1.value = g.attributes.District.toString();
                                            location_1.extra = g.attributes.CommissionerName;
                                            break;
                                        case "houseDistrictLayer":
                                            location_1.label = "Florida House";
                                            location_1.value = g.attributes.NAME;
                                            break;
                                        case "senateDistrictLayer":
                                            location_1.label = "Florida Senate";
                                            location_1.value = g.attributes.NAME;
                                            break;
                                        case "schoolboardDistrictLayer":
                                            location_1.label = "School Board District";
                                            location_1.value = g.attributes.District.toString();
                                            location_1.extra = g.attributes.Name;
                                            break;
                                        case "lamsbdLayer":
                                            location_1.label = "Lake Asbury MSBU";
                                            location_1.value = g.attributes.Name;
                                            break;
                                        case "municipalLayer":
                                            break;
                                        case "cddLayer":
                                            location_1.label = "CDD";
                                            location_1.value = g.attributes.Name;
                                            break;
                                        default:
                                    }
                                    found.push(location_1);
                                }
                            }
                        }
                        else {
                            console.log('layer no good', layer);
                        }
                    }
                    fa.Locations = found;
                }
                PrecinctLocator.FoundAddress.Finish(foundAddresses);
            });
        };
        MapController.prototype.Zoom = function (fa) {
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
                    "width": 30,
                    "height": 30,
                    "url": "http://static.arcgis.com/images/Symbols/Basic/GreenSphere.png"
                });
                var textSymbol = new TextSymbol(fa.WholeAddress); //esri.symbol.TextSymbol(data.Records[i].UnitName);
                textSymbol.setColor(new Color([0, 0, 0]));
                textSymbol.setAlign(TextSymbol.ALIGN_MIDDLE);
                textSymbol.setOffset(0, -50);
                textSymbol.setHaloColor(new Color([255, 255, 255]));
                textSymbol.setHaloSize(3);
                ll.clear();
                var pt = new Point([fa.AddressPoint.Longitude, fa.AddressPoint.Latitude]);
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
                m.centerAndZoom(pt, 14);
            });
        };
        return MapController;
    }());
    PrecinctLocator.MapController = MapController;
})(PrecinctLocator || (PrecinctLocator = {}));
//# sourceMappingURL=map.js.map