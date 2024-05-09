using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace API.Models
{
    public class ImageComment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public int? XCoord { get; set; }
        public int? YCoord { get; set; }
        [Required]
        public int ImageId { get; set; }
        [JsonIgnore]
        public Image Image { get; set; }
        public string UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }

    public class CreateImageCommentDto
    {
        public string Text { get; set; }
        public int? XCoord { get; set; } = null;
        public int? YCoord { get; set; } = null;
    }

    public class GetImageCommentDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; }
        public int? XCoord { get; set; }
        public int? YCoord { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
    }

    public class UpdateImageCommentDto
    {
        public int Text { get; set; }
        public DateTime Date = DateTime.UtcNow;
        public int XCoord { get; set; }
        public int YCoord { get; set; }
    }


}
