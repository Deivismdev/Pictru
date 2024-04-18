using System;
using System.Collections.Generic;
using System.Linq;
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
        public DateTime RegisterDate = DateTime.UtcNow;
        public ICollection<ProfileComment> ProfileComments { get; }
        public ICollection<Image> Images { get; }
    }

    public class GetUserDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Description { get; set; }

        public UserRoles role = UserRoles.Member;
        public DateTime RegisterDate = DateTime.UtcNow;
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
}