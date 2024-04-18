using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class ImageComment
    {
        public int Id { get; set; }
        public int Text { get; set; }
        public DateTime Date = DateTime.UtcNow;
        public int? XCoord { get; set; }
        public int? YCoord { get; set; }
        public int ImageId { get; set; }
        public Image Image { get; set; }
        // user
    }
    public class GetImageCommentDto
    {
        public int Text { get; set; }
        public DateTime Date = DateTime.UtcNow;

        public int XCoord { get; set; }
        public int YCoord { get; set; }
    }

    public class UpdateImageCommentDto
    {
        public int Text { get; set; }
        public DateTime Date = DateTime.UtcNow;
        public int XCoord { get; set; }
        public int YCoord { get; set; }

    }

}