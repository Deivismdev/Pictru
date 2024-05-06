using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Models
{
    public class User : IdentityUser
    {
        public string Description { get; set; }
        public string ProfileImageUrl { get; set; }
        public DateTime RegisterDate { get; set; } = DateTime.UtcNow;
        public ICollection<ProfileComment> ProfileComments { get; }
        [JsonIgnore]
        public ICollection<Image> Images { get; }
        public int Reputation { get; set; } = 0;
        public bool IsPremium { get; set; }
    }

    public class LoginDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
    public class UserDto
    {
        public string Email { get; set; }
        public string Token { get; set; }
    }

    public class RegisterDto // could derive from logindto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
    public class GetUserDto
    {
        public string Username { get; set; }
        public string Description { get; set; }
        public int Reputation { get; set; }
        public bool IsPremium { get; set; }
        public DateTime RegisterDate { get; set; }
    }

    public class GetLoggedInUserDto
    {
        public string Username { get; set; }
        public bool IsPremium { get; set; }
        public string Token { get; set; }
        public IList<string> Roles { get; set; }

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