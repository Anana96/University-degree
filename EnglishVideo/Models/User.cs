using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using System.Runtime.Serialization;

namespace EnglishVideo.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Display(Name = "Почта:")]
        public string Email { get; set; }
        [Display(Name = "Логин:")]
        public string Login { get; set; }
        [Display(Name = "Имя:")]
        public string Name { get; set; }
        [Display(Name = "Фамилия:")]
        public string Surname { get; set; }
        [Display(Name = "Пароль:")]
        public string Password { get; set; }
        [Display(Name = "Дата регистрации:")]
        public DateTime DateRegister { get; set; }
        [Display(Name = "Аватарка")]
        public string AvatarPath { get; set; }
        [Display(Name = "Рейтинг:")]
        public int Rating { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public List<Word> Words { get; set; }
        public List<Comment> Comments { get; set; }
        public List<VideoUser> VideosUser { get; set; }

        public User()
        {
            Words = new List<Word>();
            Comments = new List<Comment>();
            VideosUser = new List<VideoUser>();
        }
    
    }
}