using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace EnglishVideo.Models
{
    [Table("Videos")]
    public class Video
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

        public List<Comment> Comments { get; set; }



        public Video()
        {
            Comments = new List<Comment>();
        }



    }

    public class PageInfo
    {
        //номер текущей строницы
        public int PageNumber { get; set; }
        //количество объектов на странице
        public int PageSize { get; set; }
        //всего объектов
        public int TotalItems { get; set; }
        //всего страниц
        public int TotalPages
        {
            get { return (int)Math.Ceiling((decimal)TotalItems / PageSize); }
        }
    }

    public class CatalogViewModel
    {
        public IEnumerable<Video> Videos { get; set; }
        public PageInfo PageInfo { get; set; }
    }
}