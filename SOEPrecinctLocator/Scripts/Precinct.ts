/// <reference path="xhr.ts" />
/// <reference path="app.ts" />


namespace PrecinctLocator
{
  interface IPrecinct
  {
    Id: string;
    Name: string;
    Address: string
    Comment: string;
    LocationX: number;
    LocationY: number;
    Location: Point;
    ExtentMinX: number;
    ExtentMinY: number;
    ExtentMin: Point;
    ExtentMaxX: number;
    ExtentMaxY: number;
    ExtentMax: Point;

    GetPrecincts(): Promise<Array<Precinct>>;
  }

  export class Precinct implements IPrecinct
  {
    public Id: string;
    public Name: string;
    public Address: string
    public Comment: string;
    public LocationX: number;
    public LocationY: number;
    public Location: Point;
    public ExtentMinX: number;
    public ExtentMinY: number;
    public ExtentMin: Point;
    public ExtentMaxX: number;
    public ExtentMaxY: number;
    public ExtentMax: Point;

    constructor()
    {

    }

    GetPrecincts(): Promise<Array<Precinct>>
    {
      let x = XHR.Get("API/Precinct");
      return new Promise<Array<Precinct>>(function (resolve, reject)
      {
        x.then(function (response)
        {
          let ar: Array<Precinct> = JSON.parse(response.Text);
          return resolve(ar);
        }).catch(function ()
        {
          console.log("error in Get Precincts");
          return reject(null);
        });
      });
    }

  }

}