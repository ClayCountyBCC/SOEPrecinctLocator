/// <reference path="Typings/arcgis-js-api.d.ts" />
/// <reference path="location.ts" />
var PrecinctLocator;
(function (PrecinctLocator) {
    var MapController = /** @class */ (function () {
        function MapController(mapDiv) {
            this.mapDiv = mapDiv;
            this.PrecinctLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/VotingPrecinct/MapServer";
            this.PrecinctLocationLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/VotingPrecinct/MapServer/0";
            this.PrecinctBoundaryLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/VotingPrecinct/MapServer/1";
            this.CommissionerDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/CommissionerDistrict/MapServer/0";
            this.HouseDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/FL_HouseDist/MapServer/0";
            this.SenateDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/FL_SenateDist/MapServer/0";
            this.SchoolBoardDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/SchoolBoardDist/MapServer/0";
            this.MunicipalBoundaryLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/MunicipalBoundary/MapServer/0";
            this.CommunityDevDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/CDD/MapServer/0";
            this.LAMSBDLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/LAMSBD/MapServer/0";
            this.Layers = [];
            this.AllLocations = [];
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
                mapController.map.on("load", mapController.MapAndLayersLoadedCheck);
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
                var layersVisible = false;
                var opacityValue = 1;
                mapController.PrecinctLocationLayer =
                    new FeatureLayer(mapController.PrecinctLocationLayerURL, {
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: ["*"],
                        id: "precinctLocationDataLayer"
                    });
                mapController.Layers.push(mapController.PrecinctLocationLayer);
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
                        outFields: ["District", "OBJECTID", "Name", "Email"],
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
                        outFields: ["Name", "OBJECTID", "Id"],
                        visible: layersVisible,
                        opacity: opacityValue,
                        id: "cddLayer"
                    });
                mapController.Layers.push(mapController.CommunityDevDistrictLayer);
                mapController.LAMSBDLayer = new FeatureLayer(mapController.LAMSBDLayerURL, {
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    outFields: ["Name", "OBJECTID", "Ordinance"],
                    visible: layersVisible,
                    opacity: opacityValue,
                    id: "lamsbdLayer"
                });
                mapController.Layers.push(mapController.LAMSBDLayer);
                mapController.SetupAndQueryAllLayers(mapController.Layers);
                mapController.map.addLayers(mapController.Layers);
            });
        }
        MapController.prototype.SetupAndQueryAllLayers = function (layers) {
            require([
                "esri/tasks/query",
                "dojo/promise/all"
            ], function (Query, all) {
                var promises = [];
                var _loop_1 = function (layer) {
                    if (layer.id !== "precinctLocationLayer" && layer.id !== "locationLayer") {
                        layer.on("load", PrecinctLocator.mapController.MapAndLayersLoadedCheck);
                        var query = new Query();
                        query.where = "1=1";
                        query.outFields = ["*"];
                        var promise = layer.queryFeatures(query, function (response) {
                            PrecinctLocator.mapController.ParseFeature(PrecinctLocator.mapController.AllLocations, layer, response.features);
                        });
                        promises.push(promise);
                    }
                };
                for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
                    var layer = layers_1[_i];
                    _loop_1(layer);
                }
                all(promises).then(function () {
                    PrecinctLocator.mapController.AllLocations.sort(function (a, b) {
                        if (a.label < b.label)
                            return -1;
                        if (a.label > b.label)
                            return 1;
                        if (a.value < b.value)
                            return -1;
                        if (a.value > b.value)
                            return 1;
                        return 0;
                    });
                    PrecinctLocator.CombineLocations();
                    PrecinctLocator.BuildDistrictList();
                });
            });
        };
        MapController.prototype.MapAndLayersLoadedCheck = function (event) {
            var allLayersLoaded = true;
            for (var _i = 0, _a = PrecinctLocator.mapController.Layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                if (layer.id !== "precinctLocationLayer" && layer.id !== "locationLayer") {
                    if (!layer.loaded) {
                        allLayersLoaded = false;
                        break;
                    }
                }
            }
            if (allLayersLoaded && PrecinctLocator.mapController.map.loaded) {
                PrecinctLocator.FinishedLoading();
            }
        };
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
                "esri/tasks/query",
                "dojo/promise/all"
            ], function (Point, Polygon, Query, all) {
                var promises = [];
                var _loop_2 = function (fa) {
                    if (fa.Locations === null || fa.Locations === undefined) {
                        fa.Locations = [];
                    }
                    var pt = new Point([fa.AddressPoint.Longitude, fa.AddressPoint.Latitude]);
                    var query = new Query();
                    query.geometry = pt;
                    var _loop_3 = function (layer) {
                        if (layer.id !== "precinctLocationLayer" && layer.id !== "locationLayer") {
                            var promise = layer.queryFeatures(query, function (response) {
                                for (var _i = 0, _a = response.features; _i < _a.length; _i++) {
                                    var feature = _a[_i];
                                    if (feature.geometry.contains(pt)) {
                                        mapController.ParseFeature(fa.Locations, layer, [feature]);
                                    }
                                }
                            }, function (errorResponse) {
                                console.log('an error occurred', errorResponse);
                            });
                            promises.push(promise);
                        }
                    };
                    for (var _i = 0, _a = mapController.Layers; _i < _a.length; _i++) {
                        var layer = _a[_i];
                        _loop_3(layer);
                    }
                };
                for (var _i = 0, foundAddresses_1 = foundAddresses; _i < foundAddresses_1.length; _i++) {
                    var fa = foundAddresses_1[_i];
                    _loop_2(fa);
                }
                all(promises).then(function () {
                    PrecinctLocator.FoundAddress.Finish(foundAddresses);
                });
            });
        };
        MapController.prototype.ParseFeature = function (locations, layer, features) {
            for (var _i = 0, features_1 = features; _i < features_1.length; _i++) {
                var feature = features_1[_i];
                var location_1 = new PrecinctLocator.Location();
                location_1.id = layer.id;
                location_1.shape = feature.geometry;
                location_1.extent = feature.geometry.getExtent();
                switch (layer.id) {
                    case "precinctBoundaryLayer":
                        location_1.label = "Precinct";
                        location_1.value = feature.attributes.PRECINCT.toString();
                        break;
                    case "precinctLocationDataLayer":
                        location_1.value = feature.attributes.ID.toString();
                        location_1.label = feature.attributes.NAME.toString();
                        location_1.extra = feature.attributes.NUMBER.toString() + " " +
                            feature.attributes.NAME0.toString() + " " +
                            feature.attributes.CITY_NAME.toString();
                        break;
                    case "commissionerLayer":
                        location_1.label = "Commissioner District";
                        location_1.value = feature.attributes.District.toString();
                        location_1.extra = feature.attributes.CommissionerName;
                        break;
                    case "houseDistrictLayer":
                        location_1.label = "Florida House";
                        location_1.value = feature.attributes.District;
                        location_1.extra = feature.attributes.NAME;
                        break;
                    case "senateDistrictLayer":
                        location_1.label = "Florida Senate";
                        location_1.value = feature.attributes.District;
                        location_1.extra = feature.attributes.NAME;
                        break;
                    case "schoolboardDistrictLayer":
                        location_1.label = "School Board District";
                        location_1.value = feature.attributes.District.toString();
                        location_1.extra = feature.attributes.Name;
                        break;
                    case "lamsbdLayer":
                        location_1.label = "Lake Asbury MSBU";
                        location_1.value = feature.attributes.Name;
                        break;
                    case "municipalLayer":
                        location_1.label = "Municipality";
                        location_1.value = feature.attributes.Municipality;
                        break;
                    case "cddLayer":
                        location_1.label = "Community Dev District";
                        location_1.value = feature.attributes.Name;
                        break;
                }
                locations.push(location_1);
            }
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