using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SOEPrecinctLocator.Models;

namespace SOEPrecinctLocator.Controllers
{
  public class PrecinctController : ApiController
  {
    
    public IHttpActionResult Get()
    {
      return Ok(Precinct.GetCached());
    }

    public IHttpActionResult Post(SearchAddress sa)
    {
      return Ok(FoundAddress.Find(sa));
    }
  }
}
