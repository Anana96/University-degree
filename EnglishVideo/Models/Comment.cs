using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace EnglishVideo.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }
        [Display(Name = "Комментарий")]
        public string Text { get; set; }
        [Display(Name = "Дата публикации комментария")]
        public DateTime DateComment { get; set; }

        public int? UserId { get; set; }
        public int? VideoId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
        [ForeignKey("VideoId")]
        public Video Video { get; set; }
    }

}