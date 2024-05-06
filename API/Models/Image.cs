using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using API.Models.Enums;
using Microsoft.AspNetCore.SignalR;

namespace API.Models
{
    public class Image
    {
        public int Id { get; set; }
        public string PublicId { get; set; } // cloudinary
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public int ViewCount { get; set; } = 0;
        public int LikeCount { get; set; } = 0;
        public int ReportCount { get; set; } = 0;
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
        public string UserId { get; set; }
        public ImageState State { get; set; } = ImageState.Active;

        public ICollection<ImageComment> ImageComments { get; }
        public ICollection<Like> Likes { get; }
        public ICollection<Report> Reports { get; }
        public ICollection<Tag> Tags { get; set; } = [];
        public User User { get; set; }
    }

    public class CreateImageDto()
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public IFormFile File { get; set; }
        [Required]
        public ICollection<TagNames> Tags { get; set; }

    }
    public class UpdateImageDto()
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<TagNames> Tags { get; set; }

    }

    // nice and short name :)
    public class AppealImageSuspensionImageDto()
    {
        public ICollection<TagNames> Tags { get; set; }

    }


    public class GetImagesDto()
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public int ViewCount { get; set; }
        public int LikeCount { get; set; }
        public int ReportCount { get; set; }
        public DateTime UploadDate { get; set; }
        public ImageState ImageState { get; set; }
        public GetUserDto User { get; set; }
        public ICollection<TagNames> Tags { get; set; }

    }
    public class GetImageDto()
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public int ViewCount { get; set; }
        public int LikeCount { get; set; }
        public int ReportCount { get; set; }
        public DateTime UploadDate { get; set; }
        public ImageState ImageState { get; set; }
        public GetUserDto User { get; set; }
        public ICollection<GetImageCommentDto> ImageComments { get; set; }
        public ICollection<TagNames> Tags { get; set; }

    }
}