/// <reference path="app.ts" />
/// <reference path="point.ts" />


namespace PrecinctLocator
{
  interface IFoundAddress
  {
    WholeAddress: string;
    City: string;
    Zip: string;
    AddressPoint: Point;
    Locations: Array<Location>;
  }

  export class FoundAddress
  {
    public WholeAddress: string = "";
    public City: string = "";
    public Zip: string = "";
    public AddressPoint: Point;
    public Locations: Array<Location> = [];

    public constructor()
    {

    }

    public static Load(fa: Array<FoundAddress>):void
    {
      PrecinctLocator.mapController.GetLocations(fa);
    }

    public static Finish(fa: Array<FoundAddress>): void
    {
      FoundAddress.BuildResults(fa);


      if (fa.length > 0)
      {
        var results = document.getElementById("Results");
        window.scrollTo(0, results.offsetTop);
        mapController.Zoom(fa[0]);
      }
    }

    public static BuildResults(fa: Array<FoundAddress>): void
    {
      let results = document.getElementById("Results");
      clearElement(results);
      let df = document.createDocumentFragment();
      for (let a of fa)
      {
        let container = document.createElement("div");
        let location = document.createElement("div");
        let results = document.createElement("div");

        container.classList.add("is-marginless");
        container.classList.add("columns");
        container.style.border = "1px solid #dbdbdb";


        location.classList.add("column");
        location.classList.add("is-one-third");     
        let level = document.createElement("div");
        level.classList.add("level");
        level.style.height = "100%";
        location.appendChild(level);
        let levelItem = document.createElement("div");
        level.appendChild(levelItem);        
        let title = document.createElement("h3");
        title.classList.add("title");
        title.classList.add("is-3");
        levelItem.appendChild(title);
        if (a.City.length > 0)
        {
          title.appendChild(document.createTextNode(a.WholeAddress + " " + a.City + ", " + a.Zip))
        }
        else
        {
          title.appendChild(document.createTextNode(a.WholeAddress))
        }        
        
        results.classList.add("column");
        results.classList.add("is-two-thirds");
        results.appendChild(FoundAddress.CreateDistrictsTable(a.Locations, "#Results"));

        container.appendChild(location);
        container.appendChild(results);
        df.appendChild(container);
      }

      results.appendChild(df);
    }

    public static CreateDistrictsTable(locations: Array<Location>, tableType: string): HTMLTableElement
    {
      let table = document.createElement("table");
      table.classList.add("table");
      table.classList.add("is-fullwidth");
      table.appendChild(FoundAddress.BuildDistrictsHeaderRow());
      let tbody = document.createElement("tbody");
      table.appendChild(tbody);
      for (let l of locations)
      {
        tbody.appendChild(FoundAddress.BuildDistrictsTableRow(l, tableType));
      }
      return table;
    }

    public static BuildDistrictsHeaderRow(): HTMLTableSectionElement
    {
      let thead = document.createElement("thead");
      let tr = document.createElement("tr");
      thead.appendChild(tr);
      tr.appendChild(CreateTableColumn("Type", "TH", "30%"));
      tr.appendChild(CreateTableColumn("District", "TH", "30%"));
      tr.appendChild(CreateTableColumn("", "TH", "30%"));
      tr.appendChild(CreateTableColumn("", "TH", "10%"));

      return thead;
    }

    public static BuildDistrictsTableRow(l: Location, tableType: string): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      tr.appendChild(CreateTableColumn(l.label, "TD"));
      tr.appendChild(CreateTableColumn(l.value, "TD"));
      tr.appendChild(CreateTableColumn(l.extra, "TD"));
      tr.appendChild(FoundAddress.CreateDistrictsTableButton(l, tableType));
      return tr;
    }

    public static BuildResultsErrorRow(): HTMLTableRowElement
    {
      let tr = document.createElement("tr");
      tr.appendChild(CreateTableColumn("This address was not found.", "", "td"));
      tr.appendChild(CreateTableColumn("", "", "td"));
      return tr;
    }


    public static BuildResultsHeaderRow(): HTMLTableSectionElement
    {
      let thead = document.createElement("thead");
      let tr = document.createElement("tr");
      thead.appendChild(tr);
      tr.appendChild(CreateTableColumn("Address", "TH", "40%"));
      tr.appendChild(CreateTableColumn("Districts", "TH", "60%"));
      return thead;
    }

    public static CreateDistrictsTableButton(l: Location, tableType: string): HTMLTableCellElement
    {
      let td = document.createElement("td");
      let add = document.createElement("button");
      add.type = "button";
      add.classList.add("button");
      add.classList.add("is-primary");
      add.appendChild(document.createTextNode("View on Map"));
      if (l === null || l.shape === null)
      {
        add.disabled = true;
      }
      else
      {
        add.onclick = function ()
        {
          PrecinctLocator.RemovePreviousSelections(tableType, <HTMLTableRowElement>td.parentElement);
          add.classList.add("is-inverted");
          td.parentElement.classList.add("is-selected");
          var results = document.getElementById("Results");
          window.scrollTo(0, results.offsetTop);
          mapController.SetExtent(l);
        }
      }
      td.appendChild(add);
      return td;
    }


    // end
  }

}