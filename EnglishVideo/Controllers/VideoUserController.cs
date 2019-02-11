using EnglishVideo.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EnglishVideo.Controllers
{
    public class VideoUserController : Controller
    {
        BaseContext db = new BaseContext();


        // представление каталога собственных видео пользователя
        public ActionResult CatalogUser()
        {
            if (User.Identity.IsAuthenticated)
            {
                User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
                var videoUser = db.VideosUser.Where(u => u.UserId == user.Id).ToList();
                return View(videoUser);
            }
            return View(new List<VideoUser>());
        }


        //представление добавления нового видео пользователя
        [HttpGet]
        public ActionResult AddVideoUser()
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            ViewBag.userId = user.Id;
            return View();
        }

        //добавление видео для текущего пользователя
        [HttpPost]
        public ActionResult AddVideoUser(HttpPostedFileBase mkvVideo, HttpPostedFileBase mp4Video, HttpPostedFileBase webmVideo
                                         ,string subtitle, HttpPostedFileBase poster,
                                         int? userId, string nameVideo, string description)
        {
            if (ModelState.IsValid)
            {
                if((mkvVideo!=null || mp4Video!=null || webmVideo!=null) && subtitle!=null && poster!=null && nameVideo!="" && description!="" && userId!=null)
                {
                    string fileName;
                    string pathFolderUser = "~/User-data/" + userId + "/";
                    if (!Directory.Exists(Server.MapPath(pathFolderUser)))
                    {
                        Directory.CreateDirectory(Server.MapPath(pathFolderUser));
                    }

                    pathFolderUser = "~/User-data/" + userId + "/" + nameVideo + "/";
                    if (!Directory.Exists(Server.MapPath(pathFolderUser)))
                    {
                        Directory.CreateDirectory(Server.MapPath(pathFolderUser));
                    }

                    VideoUser video = new VideoUser();
                    video.Description = description;
                    video.NameVideo = nameVideo;
                    video.UserId = userId;

                    if (mkvVideo != null)
                    {
                        fileName = System.IO.Path.GetFileName(mkvVideo.FileName);
                        fileName = "~/User-data/" + userId + "/" + nameVideo + "/" + fileName;
                        mkvVideo.SaveAs(Server.MapPath(fileName));
                        video.PathVideoMkv = fileName;
                    }

                    if (mp4Video != null)
                    {
                        fileName = System.IO.Path.GetFileName(mp4Video.FileName);
                        fileName = "~/User-data/" + userId + "/" + nameVideo + "/" + fileName;
                        mp4Video.SaveAs(Server.MapPath(fileName));
                        video.PathVideoMp4 = fileName;
                    }

                    if (webmVideo != null)
                    {
                        fileName = System.IO.Path.GetFileName(webmVideo.FileName);
                        fileName = "~/User-data/" + userId + "/" + nameVideo + "/" + fileName;
                        webmVideo.SaveAs(Server.MapPath(fileName));
                        video.PathVideoWebm = fileName;
                    }

                    if (poster != null)
                    {
                        fileName = System.IO.Path.GetFileName(poster.FileName);
                        fileName = "~/User-data/" + userId + "/" + nameVideo + "/" + fileName;
                        poster.SaveAs(Server.MapPath(fileName));
                        video.PathPoster = fileName;
                    }


                    if (subtitle != null)
                    {
                        //fileName = System.IO.Path.GetFileName(subtitle.FileName);
                        //fileName = "~/User-data/" + userId + "/" + nameVideo + "/" + fileName;
                        //subtitle.SaveAs(Server.MapPath(fileName));
                        //video.PathSubtitle = fileName;
                        fileName = "~/User-data/" + userId + "/" + nameVideo + "/" + nameVideo + ".vtt";
                        System.IO.File.WriteAllText(Server.MapPath(fileName), subtitle);
                        video.PathSubtitle = fileName;
                    }

                    db.VideosUser.Add(video);
                    db.SaveChanges();
                    return RedirectToAction("CatalogUser");
                }
                if (nameVideo == "")
                {
                    ModelState.AddModelError("", "Введите название видео");
                }
                if (description == "")
                {
                    ModelState.AddModelError("", "Введите описание видео");
                }

                if (mkvVideo == null && mp4Video == null && webmVideo == null)
                {
                    ModelState.AddModelError("", "Загрузите видео одного из форматов");
                }

                if (subtitle == null)
                {
                    ModelState.AddModelError("", "Загрузите субтитры src");
                }

                if (poster == null)
                {
                    ModelState.AddModelError("", "Загрузите постер");
                }


                if (userId == null)
                {
                    return HttpNotFound();
                }

               
            }
            return View();
        }

        class SubtitleFile : HttpPostedFileBase
        {

        }

        //страница видео, который пользователь выбрал из собственного каталога
        public ActionResult Video(int? id)
        {
            if (id == null)
            {
                return HttpNotFound();
            }          
            VideoUser video = db.VideosUser.Find(id);
            if (video == null)
            {
                return RedirectToAction("CatalogUser");
            }
            return View(video);
        }


        //удаляет видео из базы данных 
        public ActionResult DeleteVideo(int? id)
        {
            if (id == null)
            {
                return HttpNotFound();
            }  
            VideoUser video = db.VideosUser.Find(id);
            if (video != null)
            {
                db.VideosUser.Remove(video);
                db.SaveChanges();
            }
            return RedirectToAction("CatalogUser");
        }
    }
}