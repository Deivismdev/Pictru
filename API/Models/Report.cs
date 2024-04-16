using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Report
    {
        public int Id { get; set; }
        public DateTime Date = DateTime.UtcNow;
        public int ImageId { get; set; }
        public Image Image { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

    }
}