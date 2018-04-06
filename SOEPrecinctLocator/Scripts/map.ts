/// <reference path="Typings/arcgis-js-api.d.ts" />

declare var require: any;
declare var esri: any;

namespace PrecinctLocator
{
  export class MapController
  {
    map: any;
    LocationLayer: any;
    isDrawing: boolean = false;

    constructor(public mapDiv: string)
    {
      var mapController = this;
      require([
        "esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/dijit/BasemapToggle",
        "dojo/_base/array",
        "dojo/parser",
        "dijit/layout/BorderContainer",
        "esri/toolbars/draw",
        "dojo/domReady!"],
        function (
          Map,
          ArcGISDynamicMapServiceLayer,
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
          var toggle = new BasemapToggle({
            map: mapController.map,
            basemap: "satellite" //hybrid
          }, "BaseMapToggle");
          toggle.startup();
          let SOELayer = new ArcGISDynamicMapServiceLayer("https://maps.claycountygov.com:6443/arcgis/rest/services/SOE/MapServer");//, dynamicLayerOptions);
          mapController.LocationLayer = new esri.layers.GraphicsLayer();
          mapController.map.addLayers([SOELayer, mapController.LocationLayer]);

        });
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

    public SetExtent(Precinct: Precinct)
    {
      let mapController = this;
      let m = this.map;
      require([
        "esri/geometry/Extent",
        "esri/SpatialReference"],
        function (Extent, SpatialReference)
      { 
          let e = new Extent();
          e.xmax = Precinct.ExtentMax.Longitude;
          e.ymax = Precinct.ExtentMax.Latitude;
          e.xmin = Precinct.ExtentMin.Longitude;          
          e.ymin = Precinct.ExtentMin.Latitude;
          e.spatialReference = new SpatialReference(4326);
          m.setExtent(e, true);
          console.log('map', m);
      });
    }

    public Zoom(p: any, Precinct: Precinct, Address: string): void
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
          if (Precinct !== null)
          {
            mapController.SetExtent(Precinct);
          }
          else
          {
            m.centerAndZoom(pt, 14);
          }
        });

    }

  }
}