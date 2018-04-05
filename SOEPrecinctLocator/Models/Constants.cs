using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace SOEPrecinctLocator.Models
{
  public static class Constants
  {
    public static List<T> Get_Data<T>(string query, string cs)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_ConnStr(cs)))
        {
          return (List<T>)db.Query<T>(query);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return null;
      }
    }

    public static List<T> Get_Data<T>(string query, DynamicParameters dbA, string cs, int timeOut = 60)
    {
      try
      {
        using (IDbConnection db =
          new SqlConnection(
            Get_ConnStr(cs)))
        {
          return (List<T>)db.Query<T>(query, dbA, commandTimeout: timeOut);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return null;
      }
    }

    public static int Exec_Query(string query, DynamicParameters dbA, string cs)
    {
      try
      {
        using (IDbConnection db =
          new SqlConnection(
            Get_ConnStr(cs)))
        {
          return db.Execute(query, dbA);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return -1;
      }
    }

    public static string Get_ConnStr(string cs)
    {
      try
      {
        return ConfigurationManager.ConnectionStrings[cs].ConnectionString;
      }
      catch(Exception ex)
      {
        new ErrorLog(ex);
        return null;
      }
      
    }

    

  }
}