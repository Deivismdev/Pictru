using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    [Route("api/{imageId}/likes")]
    [ApiController]
    public class LikeController : ControllerBase
    {
        private readonly AppDbContext context;
        public LikeController(AppDbContext context)
        {
            this.context = context;
        }

        [HttpPost]
        public async Task<IActionResult> LikeImage(int imageId)
        {
            var userId = "1";
            var existingLike = await context.Likes
                .FirstOrDefaultAsync(l => l.ImageId == imageId && l.UserId == userId);

            if (existingLike != null)
            {
                return BadRequest("You have already liked this image.");
            }

            var like = new Like
            {
                ImageId = imageId,
                UserId = userId,
                Date = DateTime.UtcNow
            };

            context.Likes.Add(like);
            await context.SaveChangesAsync();

            var image = await context.Images.FindAsync(imageId);
            image.LikeCount++;
            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete()]
        public async Task<IActionResult> DislikeImage(int imageId)
        {
            var userId = "1";
            var like = await context.Likes
                .FirstOrDefaultAsync(l => l.ImageId == imageId && l.UserId == userId);

            if (like == null)
            {
                return NotFound("Like not found.");
            }

            context.Likes.Remove(like);
            await context.SaveChangesAsync();

            var image = await context.Images.FindAsync(imageId);
            image.LikeCount--;
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}