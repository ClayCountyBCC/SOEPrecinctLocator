/// <reference path="map.ts" />
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
    let inputs = document.querySelectorAll<HTMLInputElement>('input[type=radio][name=district]')
    if (inputs.length > 0)
    {
      for (let i = 0; i < inputs.length; i++)
      {
        inputs[i].onchange = PrecinctLocator.BuildDistrictList;
      }
    }
    StartLoading();
    mapController = new MapController("map");
    document.getElementById("houseNumber").focus();
  }

  export function BuildDistrictList()
  {
    console.log('locations', mapController.AllLocations);
    let filter: string = (<HTMLInputElement>document.querySelector('input[name="district"]:checked')).value;
    let filtered = [];
    console.log('original', mapController.AllLocations);
    console.log('filter', filter);
    if (filter !== "all")
    {
      filtered = mapController.AllLocations.filter(function (j)
      {
        return j.id === filter;
      });
    }
    else
    {
      filtered = mapController.AllLocations;
    }
    let container = document.getElementById("DistrictList");
    clearElement(container);
    container.appendChild(FoundAddress.CreateDistrictsTable(filtered, "#DistrictList"));
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

  export function StartLoading(): void
  {
    let searchButton = <HTMLButtonElement>document.getElementById("SearchButton");
    let locationButton = <HTMLButtonElement>document.getElementById("LocationButton");
    searchButton.disabled = true;
    locationButton.disabled = true;
    searchButton.classList.add("is-loading");
    locationButton.classList.add("is-loading");
  }

  export function FinishedLoading(): void
  {
    let searchButton = <HTMLButtonElement>document.getElementById("SearchButton");
    let locationButton = <HTMLButtonElement>document.getElementById("LocationButton");
    searchButton.disabled = false;
    locationButton.disabled = true;
    searchButton.classList.remove("is-loading");
    locationButton.classList.remove("is-loading");
    CheckGeolocation();
  }

  export function GetLocation(): void
  {
    // Here we need to get a point and then do something with that point.
    HandleSearchElements("", "is-loading", true);
    navigator.geolocation.getCurrentPosition(
      function (p)
      {
        let pointToUse = new Point();
        pointToUse.Latitude = p.coords.latitude;
        pointToUse.Longitude = p.coords.longitude;
        pointToUse.IsValid = true;
        let fa = new FoundAddress();
        fa.AddressPoint = pointToUse;
        fa.WholeAddress = "Current Location";
        FoundAddress.Load([fa]);        
        HandleSearchElements("", "is-loading", false);
      }, function (e)
      {
        HandleSearchElements("", "is-loading", false);
      });
  }

  export function View(id: string)
  {
    let byAddress = document.getElementById("ByAddress");
    let navByAddress = document.getElementById("navByAddress");
    let navByMap = document.getElementById("navByMap");
    let Results = document.getElementById("Results");
    let byPrecinct = document.getElementById("ByPrecinct");
    let navByPrecinct = document.getElementById("navByPrecinct");
    let Print = document.getElementById("Print");
    //let navPrint = document.getElementById("navPrint");
    // first let's set everything to hidden;
    navByAddress.classList.remove("is-active");
    navByPrecinct.classList.remove("is-active");
    navByMap.classList.remove("is-active");
    //navPrint.classList.remove("is-active");
    byAddress.style.display = "none"; // byAddress and Results should be shown/hidden as a pair.
    Results.style.display = "none";
    byPrecinct.style.display = "none";
    Print.style.display = "none";
    switch (id)
    {
      case "ByAddress":
        navByAddress.classList.add("is-active");
        byAddress.style.display = "block";
        Results.style.display = "block";
        break;

      case "ByMap":
        navByMap.classList.add("is-active");
        break;
      //case "Print":
      //  navPrint.classList.add("is-active");
      //  Print.style.display = "block";
      //  break;
      case "ByPrecinct":
        navByPrecinct.classList.add("is-active");
        byPrecinct.style.display = "block";
        break;
    }
  }

  export function Search(): boolean
  {
    if (ValidateStreetName() || ValidateHouseNumber())
    {
      return false;
    }
    HandleSearchElements("is-loading", "", true);
    PostSearch()
      .then(function (foundAddresses)
      {
        FoundAddress.Load(foundAddresses);
        HandleSearchElements("is-loading", "", false);
        return true;
      })
      .catch(function (response)
      {
        // fail
        console.log('failed to find addresses', response);
        HandleSearchElements("is-loading", "", false);
        return false;
      });
    return true;
  }

  //function BuildPrecincts(pl: Array<Precinct>): void
  //{
  //  let Precincts = document.getElementById("ByPrecinct");
  //  clearElement(Precincts);
  //  let df = document.createDocumentFragment();
  //  let table = document.createElement("table");
  //  table.classList.add("table");
  //  df.appendChild(table);
  //  table.appendChild(BuildPrecinctsHeaderRow());
  //  let tbody = document.createElement("tbody");
  //  table.appendChild(tbody);
  //  if (pl.length === 0)
  //  {
  //    tbody.appendChild(BuildPrecinctsErrorRow());
  //  }
  //  else
  //  {
  //    for (let p of pl)
  //    {
  //      tbody.appendChild(BuildPrecinctsRow(p));
  //    }
  //  }
  //  Precincts.appendChild(df);
  //}

  //function BuildPrecinctsRow(p: Precinct): HTMLTableRowElement
  //{
  //  let tr = document.createElement("tr");
  //  tr.appendChild(CreateTableColumn(p.Id, "td"));
  //  tr.appendChild(CreateTableColumn(p.Name, "td"));    
  //  tr.appendChild(CreateTableColumn(p.Address, "td"));
  //  tr.appendChild(CreateTableColumn(p.Comment, "td"));
  //  tr.appendChild(CreatePrecinctsTableButton(p, "View on Map"));
  //  return tr;
  //}

  //function BuildPrecinctsErrorRow(): HTMLTableRowElement
  //{
  //  let tr = document.createElement("tr");
  //  tr.appendChild(CreateTableColumn("", "10%", "td"));
  //  tr.appendChild(CreateTableColumn("", "20%", "td"));
  //  tr.appendChild(CreateTableColumn("There was a problem retrieving the Precinct Information.", "", "td"));
  //  tr.appendChild(CreateTableColumn("", "25%", "td"));
  //  tr.appendChild(CreatePrecinctsTableButton(null, "View on Map"));
  //  return tr;
  //}

  //function BuildPrecinctsHeaderRow(): HTMLTableSectionElement
  //{
  //  let thead = document.createElement("thead");
  //  let tr = document.createElement("tr");
  //  thead.appendChild(tr);
  //  tr.appendChild(CreateTableColumn("Precinct #", "TH", "15%"));
  //  tr.appendChild(CreateTableColumn("Name", "TH", "20%"));
  //  tr.appendChild(CreateTableColumn("Address", "TH", "30%"));
  //  tr.appendChild(CreateTableColumn("Comment", "TH", "25%"));
  //  tr.appendChild(CreateTableColumn("", "TH", "10%"));
  //  return thead;
  //}

  export function CreateTableColumn(value: string, colTag: string, width: string = ""): HTMLTableCellElement
  {
    var d = <HTMLTableCellElement>document.createElement(colTag);
    if (width.length > 0) d.style.width = width;
    d.appendChild(document.createTextNode(value));
    return d;
  }

  //function CreatePrecinctsTableButton(p: Precinct, label: string): HTMLTableCellElement
  //{
  //  let td = document.createElement("td");
  //  let add = document.createElement("button");
  //  add.type = "button";
  //  add.classList.add("button");
  //  add.classList.add("is-primary");
  //  add.appendChild(document.createTextNode(label));
  //  if (p === null)
  //  {
  //    add.disabled = true;
  //  }
  //  else
  //  {
  //    add.onclick = function ()
  //    {
  //      document.getElementById('map').scrollIntoView();
  //      RemovePreviousSelections("#ByPrecinct", <HTMLTableRowElement>td.parentElement);
  //      add.classList.add("is-inverted");
  //      td.parentElement.classList.add("is-selected");
  //    }
  //  }
  //  td.appendChild(add);
  //  return td;
  //}

  export function RemovePreviousSelections(parentElement: string, tr: HTMLTableRowElement)
  {
    RemoveClass(parentElement + " table tr.is-selected", "is-selected");
    RemoveClass(parentElement + " table tr button.is-inverted", "is-inverted");
  }

  function RemoveClass(query: string, classToRemove: string): void
  {
    let qs = document.querySelectorAll(query);
    if (qs.length > 0)
    {
      for (let i = 0; i < qs.length; i++)
      {
        qs.item(i).classList.remove(classToRemove);
      }
    } 
  }

  function HandleSearchElements(searchButtonClass: string, locationButtonClass: string, Add: boolean)
  {
    let SearchButton = <HTMLButtonElement>document.getElementById("SearchButton");
    let LocationButton = <HTMLButtonElement>document.getElementById("LocationButton");
    if (searchButtonClass.length > 0) Add ? SearchButton.classList.add(searchButtonClass) : SearchButton.classList.remove(searchButtonClass);
    if (locationButtonClass.length > 0) Add ? LocationButton.classList.add(locationButtonClass) : LocationButton.classList.remove(locationButtonClass);
    SearchButton.disabled = Add;
    LocationButton.disabled = Add;
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
        //BuildPrecincts(precincts);
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