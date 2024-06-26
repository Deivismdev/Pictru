using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Models
{
    public class User : IdentityUser
    {
        public string Description { get; set; } = "I'm great!";
        public string ImageUrl { get; set; } = "https://res.cloudinary.com/dtj5bkeq3/image/upload/v1715155325/PICTRU_mvhgee.jpg";
        public string PublicId { get; set; } = "PICTRU_mvhgee";

        public DateTime RegisterDate { get; set; } = DateTime.UtcNow;
        public ICollection<PremiumSubscription> Subscriptions { get; set; }
        public ICollection<ProfileComment> ProfileComments { get; set; }
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
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public IList<string> Roles { get; set; }

    }

    public class GetUserProfileDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public int Reputation { get; set; }
        public bool IsPremium { get; set; }
        public DateTime RegisterDate { get; set; }
        public ICollection<GetProfileCommentsDto> ProfileComments { get; set; }
    }
    public class RegisterDto // could derive from logindto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
    public class GetUserDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
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
        [Required]
        public string Email { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }


    public class EditUserDto
    {
        public string Description { get; set; }
        public IFormFile File { get; set; }
    }

    public class SetUserPremiumDto
    {
        public bool IsPremium { get; set; }
    }

}