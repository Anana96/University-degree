using EnglishVideo.Models;
using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.Security;
using Microsoft.AspNet.Identity;
using System.Web;
using System.IO;
using System.Data.Entity;
using System.Security.Cryptography;

namespace EnglishVideo.Controllers
{
    public class AccountController : Controller
    {
        BaseContext db = new BaseContext();

        //страница авторизации пользователя
        public ActionResult Login()
        {
            return View();
        }

        //страница регистрации пользователя
        public ActionResult Register()
        {
            return View();
        }


        //проверка данных при авторизации пользователя и вход в систему
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginModel model)
        {
            if (ModelState.IsValid)
            {
                User user = null;

                user = db.Users.FirstOrDefault(u => u.Email == model.Login || u.Login == model.Login);

                if (user != null && VerifyHashedPassword(user.Password, model.Password))
                {
                    FormsAuthentication.SetAuthCookie(user.Login, true);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ModelState.AddModelError("", "Пользователя с таким логином/email и паролем нет");
                }
            }

            return View(model);
        }
        
        [HttpGet]
        public JsonResult ChangeRaiting(int raiting)
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            try
            {
                user.Rating = raiting;
                db.Entry(user).State = EntityState.Modified;
                db.SaveChanges();
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetRaiting()
        {
            User user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            if(user != null)
            {
                return Json(user.Rating, JsonRequestBehavior.AllowGet);
            }
            return Json(false, JsonRequestBehavior.AllowGet);
        }



        //добавление в базу данных пользователя и вход в систему
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                User user = null;
                user = db.Users.FirstOrDefault(u => u.Login == model.Login || u.Email == model.Email);

                if (user == null)
                {
                    // создаем нового пользователя
                    db.Users.Add(new User
                    {
                        Email = model.Email,
                        Password = HashPassword(model.Password),
                        Login = model.Login,
                        Name = model.Name,
                        Surname = model.Surname,
                        DateRegister = DateTime.Now,
                        AvatarPath = "~/Content/Images/Avatar/avatar_0.png"
                    });
                    db.SaveChanges();
                    user = db.Users.Where(u => u.Email == model.Email || u.Login == model.Login && u.Password == model.Password).FirstOrDefault();

                    // если пользователь удачно добавлен в бд
                    if (user != null)
                    {
                        FormsAuthentication.SetAuthCookie(model.Login, true);
                        return RedirectToAction("Index", "Home");
                    }
                }
                else
                {
                    ModelState.AddModelError("", "Пользователь с таким логином/email уже существует");
                }
            }

            return View(model);
        }

        //проверка зашифрованного пароля из базы и введенного пользователем
        public static bool VerifyHashedPassword(string hashedPassword, string password)
        {
            byte[] buffer4;
            if (hashedPassword == null)
            {
                return false;
            }
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            byte[] src = Convert.FromBase64String(hashedPassword);
            if ((src.Length != 0x31) || (src[0] != 0))
            {
                return false;
            }
            byte[] dst = new byte[0x10];
            Buffer.BlockCopy(src, 1, dst, 0, 0x10);
            byte[] buffer3 = new byte[0x20];
            Buffer.BlockCopy(src, 0x11, buffer3, 0, 0x20);
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, dst, 0x3e8))
            {
                buffer4 = bytes.GetBytes(0x20);
            }
            return ByteArraysEqual(buffer3, buffer4);
        }

        //сравнение последовательности байтов
        public static bool ByteArraysEqual(byte[] b1, byte[] b2)
        {
            if (b1 == b2) return true;
            if (b1 == null || b2 == null) return false;
            if (b1.Length != b2.Length) return false;
            for (int i = 0; i < b1.Length; i++)
            {
                if (b1[i] != b2[i]) return false;
            }
            return true;
        }

        //шифрование пароля
        public static string HashPassword(string password)
        {
            byte[] salt;
            byte[] buffer2;
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, 0x10, 0x3e8))
            {
                salt = bytes.Salt;
                buffer2 = bytes.GetBytes(0x20);
            }
            byte[] dst = new byte[0x31];
            Buffer.BlockCopy(salt, 0, dst, 1, 0x10);
            Buffer.BlockCopy(buffer2, 0, dst, 0x11, 0x20);
            return Convert.ToBase64String(dst);
        }


        //страница профиля текущего профиля
        public ViewResult AboutUser()
        {
            User user = null;
            user = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name);
            return View(user);
        }

        //выход из системы
        public ActionResult Logoff()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Home");
        }

        //возвращает текущего пользователя в системе на AJAX запрос
        [HttpGet]
        public JsonResult CurrentUser()
        {
            Info message = new Info
            {
                ResponseBool = User.Identity.IsAuthenticated,
                UserLogin = db.Users.FirstOrDefault(u => u.Login == User.Identity.Name).Login
            };
            return Json(message, JsonRequestBehavior.AllowGet);
        }


        //удаление пользователя
        public ActionResult DeleteUser(int? idUser)
        {
            if (idUser == null) return RedirectToAction("Index", "Home"); 
            var comment = db.Comments.Where(i => i.UserId == idUser);
            foreach(var item in comment)
            {
                db.Comments.Remove(item);
            }
            var words = db.Words.Where(i => i.UserId == idUser);
            foreach (var item in words)
            {
                db.Words.Remove(item);
            }
            var videosUser = db.VideosUser.Where(i => i.UserId == idUser);
            foreach (var item in videosUser)
            {
                db.VideosUser.Remove(item);
            }
            db.Users.Remove(db.Users.Find(idUser));
            db.SaveChanges();
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Home");
        }

        //страница редактирования профиля пользователя
        [HttpGet]
        public ActionResult EditUser(int? idUser)
        {
            if (idUser == null)
            {
                return HttpNotFound();
            }
            User user = db.Users.Find(idUser);

            if (user == null)
            {
                return HttpNotFound();
            }
            return View(user);
        }


        //редактирование профиля пользователя для базы данных
        [HttpPost]
        public ActionResult EditUser(User user)
        {
            if (ModelState.IsValid)
            {
                foreach (var item in db.Users)
                {
                    if (item.Login == user.Login && item.Id != user.Id)
                    {
                        ModelState.AddModelError("", "Пользователь с таким логином уже существует");
                        return View(user);
                    }

                    if (item.Email == user.Email && item.Id != user.Id)
                    {
                        ModelState.AddModelError("", "Пользователь с таким email уже существует");
                        return View(user);
                    }

                }
                User curUser = db.Users.Find(user.Id);
                curUser.Login = user.Login;
                curUser.Name = user.Name;
                curUser.Surname = user.Surname;
                curUser.Password = HashPassword(user.Password);
                curUser.Email = user.Email;
                db.Entry(curUser).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("AboutUser");
            }
            return View(user);
        }



        //загрузка аватарки пользователя
        public ActionResult UploadAvatar(HttpPostedFileBase upload, int idUser)
        {
            if(upload != null) { 
                string pathFolderUser = "~/User-data/"+idUser+"/";
                var currentUser = db.Users.Find(idUser);
                string fileName = System.IO.Path.GetFileName(upload.FileName);
                string pathAvatar = "~/User-data/" + idUser + "/" + fileName;
                if (!Directory.Exists(Server.MapPath(pathFolderUser)))
                {
                    Directory.CreateDirectory(Server.MapPath(pathFolderUser));
                }
                upload.SaveAs(Server.MapPath(pathAvatar));
                if (currentUser != null)
                {
                    currentUser.AvatarPath = pathAvatar;
                    db.Entry(currentUser).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            return RedirectToAction("AboutUser");
        }
    }
}
