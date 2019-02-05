using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace EnglishVideo.Models
{
    public class VideoUser
    {
            [Key]
            public int Id { get; set; }
            public string NameVideo { get; set; }
            public string PathVideoMkv { get; set; }
            public string PathVideoMp4 { get; set; }
            public string PathVideoWebm { get; set; }
            public string PathPoster { get; set; }
            public string PathSubtitle { get; set; }
            public string Description { get; set; }
            public int? UserId { get; set; }
            [ForeignKey("UserId")]
            public User User { get; set; }
    }
}
