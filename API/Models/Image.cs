using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models.Enums;
using Microsoft.AspNetCore.SignalR;

namespace API.Models
{
    public class Image
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public int ViewCount { get; set; } = 0;
        public int LikeCount { get; set; } = 0;
        public int ReportCount { get; set; } = 0;
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
        public ICollection<ImageComment> ImageComments { get; }
        public ICollection<Like> Likes { get; }
        public ICollection<Report> Reports { get; }
        public ICollection<ImageTag> Tags { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }

    public class CreateImageDto()
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public List<TagNames> Tags { get; set; }

    }
    public class UpdateImageDto()
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<TagNames> Tags { get; set; }

    }

    public class ReadImageDto()
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        // public List<ImageTag> Tags { get; set; }
        // public string ViewCount { get; set; }
        // public DateTime UploadDate { get; set; } = DateTime.UtcNow;
        // public User User { get; set; }
        // public int LikeCount { get; set; }
        // public int ReportCount { get; set; }
        // public ICollection<ImageComment> ImageComments { get; set; }
    }
}