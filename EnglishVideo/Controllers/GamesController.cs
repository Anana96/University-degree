using EnglishVideo.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace EnglishVideo.Controllers
{
    public class GamesController : Controller
    {
        BaseContext db = new BaseContext();

        // GET: Games
        public ActionResult Index()
        {
            return View();
        }


        //исправить
        public ActionResult DragAndDrops()
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            if (user != null)
            {
                return View(db.Words.OrderByDescending(x => x.Id).Where(x => x.UserId == user.Id));
            }
            return RedirectToAction("Index", "Games");
        }
        
        [HttpGet]
        public async Task<JsonResult> GetExpressionTranslator(string userName)
        {
            User user = db.Users.FirstOrDefault(u => u.Login == userName);
            if (user != null)
            {
                List<Word> words = await db.Words.Where(w => w.UserId == user.Id).ToListAsync();
                foreach(Word word in words)
                {
                    word.User = null;
                }
              //  string wordsJson = JsonConvert.SerializeObject(words);
                return Json(words, JsonRequestBehavior.AllowGet);
            }
            //return JsonConvert.SerializeObject("Все верно, друг "+user.Name);
            return Json(null, JsonRequestBehavior.AllowGet);
        }

        class EnglishRussianWord
        {
            
            public string English;
            public string Russian;
        }
    }
}