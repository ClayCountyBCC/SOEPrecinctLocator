using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SOEPrecinctLocator.Models
{
  public class Precinct
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public string Comment { get; set; }
    public double LocationX { get; set; }
    public double LocationY { get; set; }
    public LatLong Location { get; set; }
    public double ExtentMinX { get; set; }
    public double ExtentMinY { get; set; }
    public double ExtentMaxX { get; set; }
    public double ExtentMaxY { get; set; }
    

    public Precinct()
    {

    }

    public static List<Precinct> Get()
    {
      string query = @"
        SELECT
          L.ID Id,
          L.NAME Name,
          LTRIM(RTRIM(L.Number)) + ' ' + 
            LTRIM(RTRIM(NAME0)) + ' ' + 
            LTRIM(RTRIM(CITY_NAME)) + ', FL ' 
            + LTRIM(RTRIM(ZIP5)) Address,
          L.Comment1 Comment,
          L.Shape.STX LocationX,
          L.Shape.STY LocationY,
          ISNULL(B.Shape.STEnvelope().STPointN(1).STX, 0) ExtentMinX, 
          ISNULL(B.Shape.STEnvelope().STPointN(1).STY, 0) ExtentMinY,
          ISNULL(B.Shape.STEnvelope().STPointN(3).STX, 0) ExtentMaxX,
          ISNULL(B.Shape.STEnvelope().STPointN(3).STY, 0) ExtentMaxY
        FROM PRECINCT_LOCATION L
        LEFT OUTER JOIN PRECINCT_BOUNDARY B ON L.ID = B.PRECINCT
        ORDER BY L.ID";
      return Constants.Get_Data<Precinct>(query, "GIS");
    }

    public static List<Precinct> GetCached()
    {
      return (List<Precinct>)myCache.GetItem("precincts");
    }

  }
}