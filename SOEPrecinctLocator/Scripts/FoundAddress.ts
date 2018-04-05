/// <reference path="app.ts" />
/// <reference path="point.ts" />


namespace PrecinctLocator
{
  interface IFoundAddress
  {
    Precinct: string;
    WholeAddress: string;
    City: string;
    Zip: string;
    XCoord: number;
    YCoord: number;
    AddressPoint: Point;
  }

  export class FoundAddress
  {
    public Precinct: string;
    public WholeAddress: string;
    public City: string;
    public Zip: string;
    public XCoord: number;
    public YCoord: number;
    public AddressPoint: Point;

    public constructor()
    {

    }
  }

}