namespace PrecinctLocator
{
  interface IPoint
  {
    X: number;
    Y: number;
    Longitude: number;
    Latitude: number;
    IsValid: boolean;
  }

  export class Point implements IPoint
  {
    X: number;
    Y: number;
    IsValid: boolean;
    Latitude: number;
    Longitude: number;

    constructor()
    {

    }
  }
}