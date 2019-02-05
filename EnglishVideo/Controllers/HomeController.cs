using EnglishVideo.Models;
using PagedList;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EnglishVideo.Controllers
{
    public class HomeController : Controller
    {

        BaseContext db = new BaseContext();

        //страница каталог видео с пагинацией
        public ActionResult Index(int? page)
        {
            var videoPerPages = from s in db.Videos
                                select s;
            int pageSize = 6;
            int pageNumber = (page ?? 1);
            return View(videoPerPages.OrderByDescending(x => x.Id).ToPagedList(pageNumber, pageSize));
        }

        //страница каталога видео с пагинацией и поиском по названию видео
        public ViewResult Catalog(string currentFilter, string searchString, int? page)
        {
            if (searchString != null)
            {
                page = 1;
            }
            else
            {
                searchString = currentFilter;
            }

            ViewBag.CurrentFilter = searchString;

            var videoPerPages = from s in db.Videos
                                select s;
            if (!String.IsNullOrEmpty(searchString))
            {
                videoPerPages = videoPerPages.Where(s => s.NameVideo.Contains(searchString));
            }

            int pageSize = 6;
            int pageNumber = (page ?? 1);
            return View(videoPerPages.OrderByDescending(x => x.Id).ToPagedList(pageNumber, pageSize));
        }

        //страница словаря пользователя
        [HttpGet]
        public ActionResult Dictionary()
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            if (user != null)
            {

                return View(db.Words.OrderByDescending(x => x.Id).Where(x => x.UserId == user.Id));
            }
            return RedirectToAction("Index", "Home");
        }

        //удаление перевода из словаря
        public ActionResult DeleteWord(int id)
        {
            Word b = db.Words.Find(id);
            if (b != null)
            {
                db.Words.Remove(b);
                db.SaveChanges();
                return RedirectToAction("Dictionary", "Home");
            }
            return RedirectToAction("Index");
        }



        //добавление перевода в словарь
        [HttpPost]
        public JsonResult Dictionary(string eng, string rus)
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            if (user != null)
            {
                var curWord = db.Words.Where(i => i.English == eng && i.Russia == rus && i.UserId == user.Id ).ToList();
                if (curWord.Count == 0)
                {

                    db.Words.Add( new Word
                    {
                        English = eng,
                        Russia = rus,
                        UserId = user.Id
                    });
                    db.SaveChanges();
                    Info message = new Info
                    {
                        Response = "Данные добавлены"
                    };
                    return Json(message, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    Info message = new Info
                    {
                        Response = "Такой объект уже есть в базе"
                    };
                    return Json(message, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                Info message = new Info
                {
                    Response = "Ошибка, пользователь не найден"
                };
                return Json(message, JsonRequestBehavior.AllowGet);
            }
        }

        //страница видео,выбранного пользователем
        [HttpGet]
        public ActionResult Video(int? id)
        {
            if (id == null) return RedirectToAction("Index");
            Video curVideo = db.Videos.FirstOrDefault(x => x.Id == id);
            curVideo.Comments = db.Comments.OrderByDescending(x => x.Id).Where(x => x.VideoId == id).ToList();
            foreach (var comment in curVideo.Comments)
            {
                comment.User = db.Users.Find(comment.UserId);
            }
            if (curVideo != null)
            {
                ViewBag.curVideo = curVideo;
                if (User.Identity.IsAuthenticated)
                {
                    ViewBag.userId = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name).Id;
                }

                return View();
            }
            return HttpNotFound();

        }

        //добавление комментария к видео
        [HttpPost]
        public ActionResult Comment(string text, int videoId)
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            Info message = new Info();
            if (user != null) { 

                Comment newcomment = new Comment
                {
                      //  Author = user.Login,
                        Text = text,
                        UserId = user.Id,
                        VideoId = videoId,
                        DateComment = DateTime.Now,
                    };
                    db.Comments.Add(newcomment);
                    db.SaveChanges();
            }
            return  RedirectToAction("Video","Home", new{ id =videoId });
        }
        
        //удаление комментария для текущего пользователя
        public ActionResult DeleteComment(int idComment, int videoId)
        {
   
            Comment b = db.Comments.Find(idComment);
            if (b != null)
            {
                db.Comments.Remove(b);
                db.SaveChanges();
                return RedirectToAction("Video", "Home", new { id = videoId });
            }
            return RedirectToAction("Video", "Home", new { id = videoId });
        }

     


    }
}

