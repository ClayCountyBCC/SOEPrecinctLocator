/// <reference path="Typings/arcgis-js-api.d.ts" />

declare var require: any;
declare var esri: any;

namespace PrecinctLocator
{
  export class MapController
  {
    map: any;
    drawToolbar: any;
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
            //showInfoWindowOnClick: false
          }
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
          let SOELayer = new ArcGISDynamicMapServiceLayer("https://maps.claycountygov.com:6443/arcgis/rest/services/SOE/MapServer");//, dynamicLayerOptions);
          let LocationLayer = new esri.layers.GraphicsLayer();
          mapController.map.addLayers([SOELayer, LocationLayer]);

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

  }
}