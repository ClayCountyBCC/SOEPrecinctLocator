/// <reference path="Typings/arcgis-js-api.d.ts" />
/// <reference path="location.ts" />

declare var require: any;
declare var esri: any;

namespace PrecinctLocator
{
  export class MapController
  {
    map: any;
    LocationLayer: any;
    PrecinctLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/VotingPrecinct/MapServer";
    PrecinctLayer: any;
    PrecinctBoundaryLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/VotingPrecinct/MapServer/1";
    PrecinctBoundaryLayer: any;
    CommissionerDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/CommissionerDistrict/MapServer/0";
    CommissionerDistrictLayer: any;
    HouseDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/FL_HouseDist/MapServer/0";
    HouseDistrictLayer: any;
    SenateDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/FL_SenateDist/MapServer/0";
    SenateDistrictLayer: any;
    SchoolBoardDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/SchoolBoardDist/MapServer/0";
    SchoolBoardDistrictLayer: any;
    MunicipalBoundaryLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/MunicipalBoundary/MapServer/0";
    MunicipalBoundaryLayer: any;
    CommunityDevDistrictLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/CDD/MapServer/0";
    CommunityDevDistrictLayer: any;
    LAMSBDLayerURL = "https://maps.claycountygov.com:6443/arcgis/rest/services/LAMSBD/MapServer/0";
    LAMSBDLayer: any;
    Layers: Array<any> = [];


    constructor(public mapDiv: string)
    {
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
        "dojo/domReady!"],
        function (
          Map,
          SimpleFillSymbol,
          SimpleLineSymbol,
          SimpleRenderer,
          Graphic,
          esriLang,
          Color,
          ArcGISDynamicMapServiceLayer,
          FeatureLayer,
          BasemapToggle,
          arrayUtils,
          Parser,
          BorderContainer,
          Draw
        )
        {
          var mapOptions = {
            basemap: "streets",
            smartNavigation: false,
            zoom: 11,
            logo: false,
            center: [-81.80, 29.950]
          }
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
            new FeatureLayer(mapController.PrecinctBoundaryLayerURL,
              {
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["PRECINCT", "OBJECTID"],
                id: "precinctBoundaryLayer"
              });
          mapController.PrecinctBoundaryLayer.on("load", mapController.MapAndLayersLoadedCheck);
          mapController.Layers.push(mapController.PrecinctBoundaryLayer);

          let layersVisible = true;
          let opacityValue = 0;

          mapController.CommissionerDistrictLayer =
            new FeatureLayer(mapController.CommissionerDistrictLayerURL,
              {
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["District", "OBJECTID", "CommissionerName"],
                visible: layersVisible,
                opacity: opacityValue,
                id: "commissionerLayer"
              });
          mapController.CommissionerDistrictLayer.on("load", mapController.MapAndLayersLoadedCheck);
          mapController.Layers.push(mapController.CommissionerDistrictLayer);

          mapController.HouseDistrictLayer =
            new FeatureLayer(mapController.HouseDistrictLayerURL,
              {
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["District", "OBJECTID", "NAME"],
                visible: layersVisible,
                opacity: opacityValue,
                id: "houseDistrictLayer"
              });
          mapController.HouseDistrictLayer.on("load", mapController.MapAndLayersLoadedCheck);
          mapController.Layers.push(mapController.HouseDistrictLayer);

          mapController.SenateDistrictLayer =
            new FeatureLayer(mapController.SenateDistrictLayerURL,
              {
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["District", "OBJECTID", "NAME"],
                visible: layersVisible,
                opacity: opacityValue,
                id: "senateDistrictLayer"
              });
          mapController.SenateDistrictLayer.on("load", mapController.MapAndLayersLoadedCheck);
          mapController.Layers.push(mapController.SenateDistrictLayer);

          mapController.SchoolBoardDistrictLayer =
            new FeatureLayer(mapController.SchoolBoardDistrictLayerURL,
              {
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["District", "OBJECTID", "Name"],
                visible: layersVisible,
                opacity: opacityValue,
                id: "schoolboardDistrictLayer"
              });
          mapController.SchoolBoardDistrictLayer.on("load", mapController.MapAndLayersLoadedCheck);
          mapController.Layers.push(mapController.SchoolBoardDistrictLayer);

          mapController.MunicipalBoundaryLayer =
            new FeatureLayer(mapController.MunicipalBoundaryLayerURL,
              {
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["Municipality", "OBJECTID"],
                visible: layersVisible,
                opacity: opacityValue,
                id: "municipalLayer"
              });
          mapController.MunicipalBoundaryLayer.on("load", mapController.MapAndLayersLoadedCheck);
          mapController.Layers.push(mapController.MunicipalBoundaryLayer);

          mapController.CommunityDevDistrictLayer =
            new FeatureLayer(mapController.CommunityDevDistrictLayerURL,
              {
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["Name", "OBJECTID"],
                visible: layersVisible,
                opacity: opacityValue,
                id: "cddLayer"
              });
          mapController.CommunityDevDistrictLayer.on("load", mapController.MapAndLayersLoadedCheck);
          mapController.Layers.push(mapController.CommunityDevDistrictLayer);

          mapController.LAMSBDLayer = new FeatureLayer(mapController.LAMSBDLayerURL,
            {
              mode: FeatureLayer.MODE_SNAPSHOT,
              outFields: ["Name", "OBJECTID"],
              visible: layersVisible,
              opacity: opacityValue,
              id: "lamsbdLayer"
            });
          mapController.LAMSBDLayer.on("load", mapController.MapAndLayersLoadedCheck);
          mapController.Layers.push(mapController.LAMSBDLayer);
          
          mapController.map.addLayers(mapController.Layers);
        });
    }

    public MapAndLayersLoadedCheck(event)
    {
      let allLayersLoaded = true;
      for (let layer of mapController.Layers)
      {
        if (layer.id !== "precinctLocationLayer" && layer.id !== "locationLayer")
        {
          if (!layer.loaded)
          {
            allLayersLoaded = false;
            break;
          }
        }
      }
      if (allLayersLoaded && mapController.map.loaded)
      {
        PrecinctLocator.FinishedLoading();
      }
    }

    public closeDialog()
    {
      mapController.map.graphics.clear();
    }

    public CenterAndZoom(p: any): void
    {
      let mapController = this;
      let m = this.map;
      require(["esri/geometry/Point"],
        function (Point)
        {
          var pt = new Point([p.Longitude, p.Latitude]);
          m.centerAndZoom(pt, 18);
        });
    }

    public SetExtent(location: Location)
    {
      let mapController = this;
      let m = this.map;
      require([
        "esri/geometry/Extent",
        "esri/SpatialReference",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/graphic",
        "esri/Color"],
        function (Extent, SpatialReference, SimpleFillSymbol, SimpleLineSymbol, Graphic, Color)
        {
          var highlightSymbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([255, 0, 0]), 3
            ),
            new Color([125, 125, 125, 0.15])
          );
          m.graphics.clear();
          let highlightGraphic = new Graphic(location.shape, highlightSymbol);
          m.graphics.add(highlightGraphic);
          m.setExtent(location.extent, true);
        });
    }

    public GetLocations(foundAddresses: Array<FoundAddress>): void
    {
      let mapController = this;
      let m = this.map;
      require([
        "esri/geometry/Point",
        "esri/geometry/Polygon",
        "esri/tasks/query",
        "dojo/promise/all"],
        function (Point, Polygon, Query, all)
        {
          let promises = [];
          for (let fa of foundAddresses)
          {
            if (fa.Locations === null || fa.Locations === undefined)
            {
              fa.Locations = [];
            }
            let pt = new Point([fa.AddressPoint.Longitude, fa.AddressPoint.Latitude]);
            let query = new Query();
            query.geometry = pt;
            for (let layer of mapController.Layers)
            {
              if (layer.id !== "precinctLocationLayer" && layer.id !== "locationLayer")
              {

                let promise = layer.queryFeatures(query, function (response)
                {
                  for (let feature of response.features)
                  {
                    if (feature.geometry.contains(pt))
                    {
                      mapController.ParseFeature(fa.Locations, layer, feature);
                    }
                  }
                }, function (errorResponse)
                  {
                    console.log('an error occurred', errorResponse);
                  });
                promises.push(promise);
              }
            }
          }
          all(promises).then(function ()
          {
            FoundAddress.Finish(foundAddresses);
          });
        });
    }
    
    public ParseFeature(locations: Array<Location>, layer: any, feature: any): void
    {
      let location = new Location();
      location.id = layer.id;
      location.shape = feature.geometry;
      location.extent = feature.geometry.getExtent();

      switch (layer.id)
      {
        case "precinctBoundaryLayer":
          location.label = "Precinct";
          location.value = feature.attributes.PRECINCT.toString();
          break;

        case "commissionerLayer":
          location.label = "Commissioner District";
          location.value = feature.attributes.District.toString();
          location.extra = feature.attributes.CommissionerName;
          break;

        case "houseDistrictLayer":
          location.label = "Florida House";
          location.value = feature.attributes.NAME;
          break;

        case "senateDistrictLayer":
          location.label = "Florida Senate";
          location.value = feature.attributes.NAME;
          break;

        case "schoolboardDistrictLayer":
          location.label = "School Board District";
          location.value = feature.attributes.District.toString();
          location.extra = feature.attributes.Name;
          break;

        case "lamsbdLayer":
          location.label = "Lake Asbury MSBU"
          location.value = feature.attributes.Name;
          break;

        case "municipalLayer":
          location.label = "Municipality";
          location.value = feature.attributes.Municipality;
          break;

        case "cddLayer":
          location.label = "CDD";
          location.value = feature.attributes.Name;
          break;

      }
      locations.push(location);
    }

    public Zoom(fa: FoundAddress): void
    {
      let mapController = this;
      let m = this.map;
      let ll = this.LocationLayer;
      require(["esri/geometry/Point",
        "esri/symbols/PictureMarkerSymbol",
        "esri/graphic",
        "esri/SpatialReference",
        "esri/symbols/TextSymbol",
        "esri/Color"],
        function (Point, PictureMarkerSymbol, Graphic, SpatialReference, TextSymbol, Color)
        {
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

    }

  }
}