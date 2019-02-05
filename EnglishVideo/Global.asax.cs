using System;
using System.Collections.Generic;
using EnglishVideo.Models;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Data.Entity;


namespace EnglishVideo
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            //удаление всех видео
            //BaseContext db = new BaseContext();
            //var video = db.Videos.Where(u => u.Id > 0);
            //if (video != null)
            //{

            //    foreach( Video p in video)
            //    {
            //        db.Videos.Remove(p);

            //    }

            //}
            //db.SaveChanges();

            //инициализация видео
            //Vovovo vo = new Vovovo();
            //vo.AddVideo();

            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
