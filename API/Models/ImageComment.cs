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
        public int XCoord { get; set; }
        public int YCoord { get; set; }

        public int ImageId { get; set; }
        public Image Image { get; set; }
    }
}