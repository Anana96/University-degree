using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EnglishVideo.Models
{
    //для входа на сайт
    public class LoginModel
    {
        [Display(Name = "Логин:")]
        [Required(ErrorMessage = "Логин/почта не указана")]
        public string Login { get; set; }
      
        [Display(Name = "Пароль:")]
        [Required(ErrorMessage = "Пароль не указан")]
        public string Password { get; set; }
   //     public string Email { get; set; }
    }

    //при регистрации
    public class RegisterModel
    {
        [Required(ErrorMessage ="Почта не указана")]
        [RegularExpression(@"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}", ErrorMessage = "Некорректный адрес")]
        [Display(Name = "Почта")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Логин не указан")]
        [Display(Name = "Логин")]
        public string Login { get; set; }
        [Required(ErrorMessage = "Имя не указано")]
        [Display(Name = "Имя")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Фамилия не указана")]
        [Display(Name = "Фамилия")]
        public string Surname { get; set; }
        [Required(ErrorMessage = "Пароль не указан")]
        [Display(Name = "Пароль")]
        public string Password { get; set; }
        [Compare("Password", ErrorMessage = "Пароли не совпадают")]
        [Display(Name = "Повторите пароль")]
        [DataType(DataType.Password)]
        public virtual string PasswordConfirm { get; set; }
        public DateTime DateRegister { get; set; }

    }
}