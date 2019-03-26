using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EnglishVideo.Models
{
    public class Raitings
    {
        [Display(Name = "Логин:")]
        public string Login { get; set; }
        [Display(Name = "Рейтинг:")]
        public int Raiting { get; set; }

        public Raitings(string login, int raiting)
        {
            Login = login;
            Raiting = raiting;
        }
    }

}
