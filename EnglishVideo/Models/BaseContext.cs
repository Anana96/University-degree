using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace EnglishVideo.Models
{
    public class BaseContext : DbContext

    {
        public DbSet<User> Users { get; set; }
        public DbSet<Video> Videos { get; set; }
        public DbSet<VideoUser> VideosUser { get; set; } //таблица со значениями словарей
        public DbSet<Word> Words { get; set; } //таблица со значениями словарей
        public DbSet<Comment> Comments { get; set; }
    }
}