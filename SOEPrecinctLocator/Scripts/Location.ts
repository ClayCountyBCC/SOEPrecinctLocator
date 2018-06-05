
namespace PrecinctLocator
{
  interface ILocation
  {
    id: string;
    name: string;
    label: string;
    value: string;
    extra: string;
    shape: any;
    extent: any;
  }

  export class Location implements ILocation
  {
    public id: string;
    public name: string;
    public label: string;
    public value: string;
    public extra: string = "";
    public shape: any;
    public extent: any;

    constructor()
    {

    }
    
  }


}