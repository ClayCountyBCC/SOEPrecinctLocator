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
    
    public List<Precinct> Get()
    {
      return Precinct.GetCached();
    }

    public List<FoundAddress> Post(SearchAddress sa)
    {
      return FoundAddress.Find(sa);
    }
  }
}
