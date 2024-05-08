using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(AppDbContext appDbContext, UserManager<User> userManager)
        {
            if (!userManager.Users.Any())
            {
                var moderator = new User
                {
                    UserName = "premium",
                    Email = "premium@bobber.com",
                    Description = "premium user",
                    IsPremium = true,
                    Reputation = 100
                };

                await userManager.CreateAsync(moderator, "P@ssword1");
                await userManager.AddToRolesAsync(moderator, new[] { "Member", "Moderator" });

                var pleb = new User
                {
                    UserName = "pleb",
                    Email = "pleb@bobber.com",
                    Description = "just a pleb",
                    Reputation = -10
                };
                await userManager.CreateAsync(pleb, "P@ssword1");
                await userManager.AddToRoleAsync(pleb, "Member");

            }
        }
    }
}