using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SOEPrecinctLocator.Models
{
  public class Precinct
  {
    public int BoundaryId { get; set; }
    public string Id { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public string Comment { get; set; }
    public double LocationX { get; set; } = double.MinValue;
    public double LocationY { get; set; } = double.MinValue;
    public Point Location
    {
      get
      {
        return new Point(LocationX, LocationY);
      }
    }
    public double ExtentMinX { get; set; } = double.MinValue;
    public double ExtentMinY { get; set; } = double.MinValue;
    public Point ExtentMin
    {
      get
      {
        return new Point(ExtentMinX, ExtentMinY);
      }
    }
    public double ExtentMaxX { get; set; } = double.MinValue;
    public double ExtentMaxY { get; set; } = double.MinValue;
    public Point ExtentMax
    {
      get
      {
        return new Point(ExtentMaxX, ExtentMaxY);
      }
    }

    public Precinct()
    {

    }

    public static List<Precinct> Get()
    {
      string query = @"
        SELECT
          B.OBJECTID BoundaryId,
          L.ID Id,
          L.NAME Name,
          LTRIM(RTRIM(L.Number)) + ' ' + 
            LTRIM(RTRIM(NAME0)) + ' ' + 
            LTRIM(RTRIM(CITY_NAME)) + ', FL ' 
            + LTRIM(RTRIM(ZIP5)) Address,
          ISNULL(LTRIM(RTRIM(L.Comment1)), '') Comment,
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