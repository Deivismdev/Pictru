using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace API.Models
{
    public class ProfileComment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public bool Edited = false;
        public string UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }

    public class CreateProfileCommentDto
    {
        [Required]
        public string Text { get; set; }
    }
    public class UpdateProfileCommentDto
    {
        [Required]
        public string Text { get; set; }
    }

    public class GetProfileCommentsDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
    }
}