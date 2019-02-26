using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace EnglishVideo.Models
{
    public class Word
    {
        [JsonIgnore]
        [Key]
        public int Id { get; set; }
        [Display(Name = "Слова на английском")]
        public string English { get; set ; }
        [Display(Name = "Слова на русском")]
        public string Russia { get ; set; }
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}