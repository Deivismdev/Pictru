using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class ProfileComment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public bool Edited = false;
        public int UserId { get; set; }
        public User User { get; set; }
    }

    public class CreateProfileCommentDto
    {
        public string Text { get; set; }
    }
    public class UpdateProfileCommentDto
    {
        public string Text { get; set; }

    }
}