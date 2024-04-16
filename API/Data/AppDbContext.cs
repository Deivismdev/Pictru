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
        public DbSet<ImageTag> ImageTags { get; set; }
        public DbSet<ImageComment> ImageComments { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<ProfileComment> ProfileComments { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Tag> Tags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var tagNames = Enum.GetValues(typeof(TagNames))
                               .Cast<TagNames>()
                               .Select((tag, index) => new Tag { Id = index + 1, Name = tag });

            modelBuilder.Entity<Tag>().HasData(tagNames);

            base.OnModelCreating(modelBuilder);
        }
    }
}
