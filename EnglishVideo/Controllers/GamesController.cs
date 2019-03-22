using EnglishVideo.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Net.Http;
using Newtonsoft.Json.Linq;

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

        [HttpGet]
        public async Task<JsonResult> OxfordApi(string word)
        {
            if (word.Length > 0)
            {
                string app_id = "df57cfab";
                string app_key = "6901e4149ed64fce7ebcd66b50711b93";
                string language = "en";
                string url = $"https://od-api.oxforddictionaries.com:443/api/v1/entries/{language}/{word}/sentences";
                //var request = new HttpRequestMessage
                //{
                //    RequestUri = new Uri(url),
                //    Method = HttpMethod.Get,

                //    Headers = {
                //        { "api_id", app_id },
                //        { "app_key", app_key},
                //    },
                //    Content = new StringContent(JsonConvert.SerializeObject(svm))
                //};
                using(var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(url);
                    client.DefaultRequestHeaders.Add("app_id", app_id);
                    client.DefaultRequestHeaders.Add("app_key", app_key);
                    //var response = await client.GetStringAsync(url);
                    //response = JsonConvert.DeserializeObject<object>(response);
                    var response = await client.GetStringAsync(url);
                    return Json(response, JsonRequestBehavior.AllowGet);
                }
                
            }
            else
                return Json(null, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public async Task<JsonResult> OxfordRequest(string word)
        {
            if (word.Length > 0)
            {
                string app_id = "df57cfab";
                string app_key = "6901e4149ed64fce7ebcd66b50711b93";
                string language = "en";
                string url = $"https://od-api.oxforddictionaries.com:443/api/v1/entries/{language}/{word}";
                //var request = new HttpRequestMessage
                //{
                //    RequestUri = new Uri(url),
                //    Method = HttpMethod.Get,

                //    Headers = {
                //        { "api_id", app_id },
                //        { "app_key", app_key},
                //    },
                //    Content = new StringContent(JsonConvert.SerializeObject(svm))
                //};
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(url);
                    client.DefaultRequestHeaders.Add("app_id", app_id);
                    client.DefaultRequestHeaders.Add("app_key", app_key);
                    //var response = await client.GetStringAsync(url);
                    //response = JsonConvert.DeserializeObject<object>(response);
                    var response = await client.GetStringAsync(url);
                    return Json(response, JsonRequestBehavior.AllowGet);
                }

            }
            else
                return Json(null, JsonRequestBehavior.AllowGet);
        }


        public ActionResult SecondGame()
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            if (user != null)
            {
                return View();
            }
            return RedirectToAction("Index", "Games");
        }

        public ActionResult ThirdGame()
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            if (user != null)
            {
                return View();
            }
            return RedirectToAction("Index", "Games");
        }

        public ActionResult SpeechGame()
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            if (user != null)
            {
                return View();
            }
            return RedirectToAction("Index", "Games");
        }

        public ActionResult FiveGame()
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            if (user != null)
            {
                return View();
            }
            return RedirectToAction("Index", "Games");
        }




        //class EnglishRussianWord
        //{

        //    public string English;
        //    public string Russian;
        //}
    }
}