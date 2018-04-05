﻿/// <reference path="map.ts" />
/// <reference path="xhr.ts" />
/// <reference path="precinct.ts" />
/// <reference path="foundaddress.ts" />


namespace PrecinctLocator
{
  export let Precincts: Array<Precinct> = [];
  export let mapController: MapController;

  function IsInteger(value) : boolean
  {
    return typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value;
  };

  export function Start(): void
  {
    mapController = new MapController("map");
    CheckGeolocation();
    document.getElementById("houseNumber").focus();
    GetPrecincts();
  }

  function CheckGeolocation()
  {
    let b = <HTMLButtonElement>document.getElementById("LocationButton");
    if ("geolocation" in navigator)
    {
      // let's show the get location button.
      b.style.visibility = "visible";
      b.disabled = false;
    }
    else
    {
      b.disabled = true;
      b.style.visibility = "hidden";
    }
  }

  export function GetLocation(): void
  {
    // Here we need to get a point and then do something with that point.
    SearchStart("", "is-loading");
    navigator.geolocation.getCurrentPosition(
      function (p)
      {
        let PointToUse = {
          Latitude: p.coords.latitude,
          Longitude: p.coords.longitude
        };
        document.getElementById('map').scrollIntoView();
        mapController.Zoom(PointToUse, "");
        SearchEnd("", "is-loading");
      }, function (e)
      {
        SearchEnd("", "is-loading");
      });
  }

  export function View(id: string)
  {
    let byAddress = document.getElementById("ByAddress");
    let navByAddress = document.getElementById("navByAddress");
    let Results = document.getElementById("Results");
    let byPrecinct = document.getElementById("ByPrecinct");
    let navByPrecinct = document.getElementById("navByPrecinct");
    if (id === "ByAddress")
    {
      navByAddress.classList.add("is-active");
      navByPrecinct.classList.remove("is-active");
      byAddress.style.display = "block";
      byPrecinct.style.display = "none";
      Results.style.display = "block";
    }
    else
    {
      navByAddress.classList.remove("is-active");
      navByPrecinct.classList.add("is-active");
      byAddress.style.display = "none";
      byPrecinct.style.display = "block";
      Results.style.display = "none";
    }
  }

  export function Search(): boolean
  {
    if (ValidateStreetName() || ValidateHouseNumber())
    {
      console.log('returning false');
      return false;
    }
    SearchStart("is-loading", "");
    PostSearch()
      .then(function (foundAddresses)
      {
        console.log('found addresses', foundAddresses);
        BuildResults(foundAddresses);
        SearchEnd("is-loading", "");
        return true;
      })
      .catch(function ()
      {
        // fail
        console.log('failed to find addresses');
        SearchEnd("is-loading", "");
        return false;
      });
    return true;
  }

  function BuildPrecincts(pl: Array<Precinct>): void
  {
    let Precincts = document.getElementById("ByPrecinct");
    clearElement(Precincts);
    let df = document.createDocumentFragment();
    let table = document.createElement("table");
    table.classList.add("table");
    df.appendChild(table);
    table.appendChild(BuildPrecinctsHeaderRow());
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (let p of pl)
    {
      tbody.appendChild(BuildPrecinctsRow(p));
    }
    Precincts.appendChild(df);
  }

  function BuildResults(fa: Array<FoundAddress>):void
  {
    let results = document.getElementById("Results");
    clearElement(results);
    let df = document.createDocumentFragment();
    let table = document.createElement("table");
    table.classList.add("table");
    df.appendChild(table);
    table.appendChild(BuildResultsHeaderRow());
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (let a of fa)
    {
      tbody.appendChild(BuildResultsRow(a));
    }
    results.appendChild(df);
  }

  function BuildPrecinctsRow(p: Precinct): HTMLTableRowElement
  {
    let tr = document.createElement("tr");
    tr.appendChild(CreateTableElement(p.Id, "15%", "td"));
    tr.appendChild(CreateTableElement(p.Name, "20%", "td"));    
    tr.appendChild(CreateTableElement(p.Address, "30%", "td"));
    tr.appendChild(CreateTableElement(p.Comment, "30%", "td"));
    tr.appendChild(CreatePrecinctsTableButton(p, "10%"));
    return tr;
  }

  function BuildResultsRow(fa: FoundAddress): HTMLTableRowElement
  {
    let tr = document.createElement("tr");
    tr.appendChild(CreateTableElement(fa.WholeAddress + " " + fa.City + ", " + fa.Zip, "40%", "td"));
    tr.appendChild(CreateTableElement(fa.Precinct, "15%", "td"));
    let p = Precincts.filter(function (j)
    {
      return j.Id === fa.Precinct;
    });
    tr.appendChild(CreateTableElement(p[0].Name, "35%", "td"));
    tr.appendChild(CreateResultsTableButton(fa.AddressPoint, fa.WholeAddress, "10%"));
    return tr;
  }

  function BuildPrecinctsHeaderRow(): HTMLTableSectionElement
  {
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    tr.appendChild(CreateTableElement("Precinct #", "15%", "TH"));
    tr.appendChild(CreateTableElement("Name", "20%", "TH"));
    tr.appendChild(CreateTableElement("Address", "30%", "TH"));
    tr.appendChild(CreateTableElement("Comment", "25%", "TH"));
    tr.appendChild(CreateTableElement("", "10%", "TH"));
    return thead;
  }

  function BuildResultsHeaderRow():HTMLTableSectionElement
  {
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    tr.appendChild(CreateTableElement("Address Found", "40%", "TH"));
    tr.appendChild(CreateTableElement("Precinct #", "15%", "TH"));
    tr.appendChild(CreateTableElement("Precinct Info", "35%", "TH"));
    tr.appendChild(CreateTableElement("", "10%", "TH"));
    return thead;
  }

  function CreateTableElement(value, width, colTag)
  {
    var d = document.createElement(colTag);
    d.style.width = width;
    d.appendChild(document.createTextNode(value));
    return d;
  }

  function CreateResultsTableButton(point: Point, Address: string, width: string): HTMLTableCellElement
  {
    let td = document.createElement("td");
    td.style.width = width;
    let add = document.createElement("button");
    add.type = "button";
    add.classList.add("button");
    add.classList.add("is-primary");
    add.appendChild(document.createTextNode("View on Map"));
    add.onclick = function ()
    {
      var results = document.getElementById("Results");
      window.scrollTo(0, results.offsetTop);
      mapController.Zoom(point, Address);
    }
    td.appendChild(add);
    return td;
  }

  function CreatePrecinctsTableButton(p: Precinct, width: string): HTMLTableCellElement
  {
    let td = document.createElement("td");
    td.style.width = width;
    let add = document.createElement("button");
    add.type = "button";
    add.classList.add("button");
    add.classList.add("is-primary");
    add.appendChild(document.createTextNode("View on Map"));
    add.onclick = function ()
    {
      
      document.getElementById('map').scrollIntoView();
      mapController.SetExtent(p);
    }
    td.appendChild(add);
    return td;
  }

  function SearchStart(searchButtonClass: string, locationButtonClass: string):void
  {
    let SearchButton = <HTMLButtonElement>document.getElementById("SearchButton");
    let LocationButton = <HTMLButtonElement>document.getElementById("LocationButton");    
    if (searchButtonClass.length > 0) SearchButton.classList.add(searchButtonClass);
    if (locationButtonClass.length > 0) LocationButton.classList.add(locationButtonClass);
    SearchButton.disabled = true;
    LocationButton.disabled = true;
  }

  function SearchEnd(searchButtonClass: string, locationButtonClass: string): void
  {
    let SearchButton = <HTMLButtonElement>document.getElementById("SearchButton");
    let LocationButton = <HTMLButtonElement>document.getElementById("LocationButton");
    if (searchButtonClass.length > 0) SearchButton.classList.remove(searchButtonClass);
    if (locationButtonClass.length > 0) LocationButton.classList.remove(locationButtonClass);
    SearchButton.disabled = false;
    LocationButton.disabled = false;
  }

  export function ValidateStreetName(): boolean
  {
    let streetName = <HTMLInputElement>document.getElementById("streetName");
    let streetNameError = <HTMLParagraphElement>document.getElementById("streetNameError");
    streetName.value = streetName.value.trim();
    let isError = streetName.value.length < 3;
    if (isError)
    {
      streetNameError.style.display = "block";
      streetName.classList.add("is-danger");
    }
    else
    {
      streetNameError.style.display = "none";
      streetName.classList.remove("is-danger");
    }
    console.log('ValidateStreetName', isError);
    return isError;
  }

  export function ValidateHouseNumber(): boolean
  {
    let houseNumber = <HTMLInputElement>document.getElementById("houseNumber");
    let houseNumberError = <HTMLParagraphElement>document.getElementById("houseNumberError");
    houseNumber.value = houseNumber.value.trim();
    let isError = houseNumber.value.length === 0 || !IsInteger(parseInt(houseNumber.value));
    if (isError)
    {
      houseNumberError.style.display = "block";
      houseNumber.classList.add("is-danger");
    }
    else
    {
      houseNumberError.style.display = "none";
      houseNumber.classList.remove("is-danger");
    }
    console.log('ValidateHouseNumber', isError);
    return isError;
  }

  function GetPrecincts()
  {
    let p = new Precinct();
    p.GetPrecincts()
      .then(function (precincts: Array<Precinct>)
      {
        console.log('Precincts Returned', precincts);
        Precincts = precincts;
        BuildPrecincts(precincts);
      }, function (): void
        {
          console.log('error getting precincts');
          Precincts = [];
        });
  }

  function PostSearch():Promise<Array<FoundAddress>>
  {
    let houseNumber = <HTMLInputElement>document.getElementById("houseNumber");
    let streetName = <HTMLInputElement>document.getElementById("streetName");
    let SearchAddress = {
      house: parseInt(houseNumber.value),
      street: streetName.value.toUpperCase()
    }
    let x = XHR.Post("API/Precinct", JSON.stringify(SearchAddress));
    return new Promise<Array<FoundAddress>>(function (resolve, reject)
    {
      x.then(function (response)
      {
        let ar: Array<FoundAddress> = JSON.parse(response.Text);
        return resolve(ar);
      }).catch(function ()
      {
        console.log("error in Get Precincts");
        return reject(null);
      });
    });
  }

  export function clearElement(node: HTMLElement): void
  {
    if (node === undefined || node === null) return;
    while (node.firstChild)
    {
      node.removeChild(node.firstChild);
    }
  }
}