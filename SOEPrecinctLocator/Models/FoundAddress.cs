using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web;

namespace SOEPrecinctLocator.Models
{
  public class FoundAddress
  {
    public string Precinct { get; set; } = "";
    public string WholeAddress { get; set; }
    public string City { get; set; }
    public string Zip { get; set; }
    public double XCoord { get; set; } = double.MinValue;
    public double YCoord { get; set; } = double.MinValue;
    public Point AddressPoint
    {
      get
      {
        return new Point(XCoord, YCoord);
      }
    }

    public FoundAddress()
    {

    }

    public static List<FoundAddress> Find(SearchAddress sa)
    {
      sa.street = sa.street.ToUpper().Trim();
      var replacements = new Dictionary<string, string>
      { { " RD", "" },
        { " ROAD", "" },
        { " DR", "" },
        { " DRIVE", "" },
        { " PKWY", "" },
        { " CT", "" },
        { " LN", "" },
        { " LANE", "" },
        { " BLVD", "" },
        { " ST", "" },
        { " STREET", "" },
        { " CIR", "" },
        { " CV", "" },
        { " PT", "" },
        { " RUN", "" },
        { " TR", "" },
        { " CONC", "" },
        { " TER", "" },
        { " TRC", "" },
        { " LOOP", "" },
        { " WAY", "" }
      };

      var filtered = replacements.Aggregate(sa.street, (current, replacement) => current.Replace(replacement.Key, replacement.Value));
      var dpa = new DynamicParameters();
      dpa.Add("@house", sa.house);
      dpa.Add("@street", sa.street);
      dpa.Add("@filtered", filtered);
      string query = $@"
        WITH AddressPoints AS (
          SELECT 
            UPPER(WholeAddress) AS WholeAddress, 
            Community AS City,
            Zip, 
            XCoord,
            YCoord,
            Shape 
          FROM ADDRESS_SITE 
	        WHERE (UPPER(WholeAddress) LIKE '%' + @street + '%' OR 
            UPPER(WholeAddress) LIKE '%' + @filtered + '%') 
		        AND House = @house
        )

        SELECT DISTINCT  
        A.WholeAddress,
        A.City,
        A.Zip,
        A.XCoord,
        A.YCoord,
        B.PRECINCT Precinct
        FROM AddressPoints A 
        INNER JOIN PARCEL_INFO P ON P.Shape.STIntersects(A.Shape) = 1
        INNER JOIN PRECINCT_BOUNDARY B ON P.Shape.STIntersects(B.Shape) = 1";
      try
      {
        using (IDbConnection db = new SqlConnection(ConfigurationManager.ConnectionStrings["GIS"].ConnectionString))
        {
          List<FoundAddress> fal = (List<FoundAddress>)db.Query<FoundAddress>(query, dpa);
          return fal;
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return null;
      }
    }
  }
}