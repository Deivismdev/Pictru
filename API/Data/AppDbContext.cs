using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Image> Images { get; set; }
        // public DbSet<ImageTag> ImageTags { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<ImageComment> ImageComments { get; set; }
        public DbSet<ProfileComment> ProfileComments { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            var tagNames = Enum.GetValues(typeof(TagNames))
                               .Cast<TagNames>()
                               .Select((tag, index) => new Tag { Id = index + 1, Name = tag });

            modelBuilder.Entity<Tag>().HasData(tagNames);
            // modelBuilder.Entity<ImageTag>(x => x.HasKey(p => new { p.ImageId, p.TagId }));

            var testUser = new User
            {
                Id = 1,
                Email = "test@example.com",
                Username = "TestUser",
                Password = "TestPassword123",
                Description = "This is a test user.",
                ProfileImageUrl = "https://example.com/test-user-profile.jpg",
                RegisterDate = DateTime.UtcNow
            };
            modelBuilder.Entity<User>().HasData(testUser);

            base.OnModelCreating(modelBuilder);
        }
    }
}
