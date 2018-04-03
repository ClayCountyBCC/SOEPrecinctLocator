/// <reference path="map.ts" />
/// <reference path="xhr.ts" />


namespace PrecinctLocator
{
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
  }

  function CheckGeolocation()
  {
    let b = <HTMLButtonElement>document.getElementById("UseLocation");
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
    navigator.geolocation.getCurrentPosition(
      function (p)
      {
        console.log(p);
      });
  }

  export function Search(e: Event):boolean
  {
    e.preventDefault();
    if (!ValidateStreetName() || !ValidateHouseNumber()) return false;
    return true;
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



}