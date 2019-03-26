using EnglishVideo.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

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
                return View();
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
        public async Task<JsonResult> OxfordSentense(string word)
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
                    var response = await client.GetAsync(url);
                    if (!response.IsSuccessStatusCode)
                    {
                        return Json("word not found", JsonRequestBehavior.AllowGet);
                    }
                    var responseText = await client.GetStringAsync(url);
                    return Json(responseText, JsonRequestBehavior.AllowGet);
                }
                
            }
            else
                return Json(null, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public async Task<JsonResult> OxfordAudio(string word)
        {
            if (word.Length > 0)
            {
                string app_id = "df57cfab";
                string app_key = "6901e4149ed64fce7ebcd66b50711b93";
                string language = "en";
                string url = $"https://od-api.oxforddictionaries.com:443/api/v1/entries/{language}/{word}";
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(url);
                    client.DefaultRequestHeaders.Add("app_id", app_id);
                    client.DefaultRequestHeaders.Add("app_key", app_key);
                    //var response = await client.GetStringAsync(url);
                    //response = JsonConvert.DeserializeObject<object>(response);
                    var response = await client.GetAsync(url);
                    if (!response.IsSuccessStatusCode)
                    {
                        return Json("audio not found", JsonRequestBehavior.AllowGet);
                    }
                    var responseText = await client.GetStringAsync(url);
                    return Json(responseText, JsonRequestBehavior.AllowGet);
                }

            }
            else
                return Json(null, JsonRequestBehavior.AllowGet);
        }


        public ActionResult WordTranslationGame()
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            if (user != null)
            {
                return View();
            }
            return RedirectToAction("Index", "Games");
        }

        public ActionResult ExampleSentencesGame()
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

        public ActionResult AudioGame()
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            if (user != null)
            {
                return View();
            }
            return RedirectToAction("Index", "Games");
        }

        [HttpGet]
        public async Task<JsonResult> GetBookAsync()
        {
            string path = "~/Content/Books/Winnie-the-Pooh.txt";
            path = Server.MapPath(path);
            //var str = System.IO.File.OpenRead(path);
            //    var result = System.IO.File.OpenText(@path).ReadToEnd();
            //    result =
            //   string[] str = System.IO.File.OpenText(@path).ReadToEnd().Split('.', '!', '?');
            try
            {
                StreamReader reader = new StreamReader(path, Encoding.GetEncoding(1251));
                var book = await reader.ReadToEndAsync();
              //  string[] arrayBook = book.Split('.', '!', '?');
              
                return Json(book, JsonRequestBehavior.AllowGet);
            }
            catch {
               return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public ViewResult GetAllRaiting()
        {
            //var sortedUsers = from u in db.Users
            //                  orderby u.Rating descending
            //                  select u;
            var sortedUsers = db.Users.OrderByDescending(u => u.Rating);
            List<Raitings> usersRaitings = new List<Raitings>();
            foreach(var user in sortedUsers)
            {
                Raitings userRaiting = new Raitings(user.Login, user.Rating);
                usersRaitings.Add(userRaiting);
            }
            return View(usersRaitings);
        }



        //class EnglishRussianWord
        //{

        //    public string English;
        //    public string Russian;
        //}
    }
}