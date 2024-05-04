using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Description { get; set; }
        public string ProfileImageUrl { get; set; }
        public UserRoles Role = UserRoles.Member;
        public DateTime RegisterDate { get; set; } = DateTime.UtcNow;
        public ICollection<ProfileComment> ProfileComments { get; }
        [JsonIgnore]
        public ICollection<Image> Images { get; }
        public int Reputation { get; set; } = 0;
        public bool IsPremium { get; set; }
    }

    public class GetUserDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Description { get; set; }
        public int Reputation { get; set; }
        public bool IsPremium { get; set; }

        public UserRoles Role { get; set; }
        public DateTime RegisterDate { get; set; }
    }

    public class CreateUserDto
    {
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }


    public class EditUserDto
    {
        public string Description { get; set; }
        public string ProfileImageUrl { get; set; }
    }

    public class SetUserPremiumDto
    {
        public bool IsPremium { get; set; }
    }
}