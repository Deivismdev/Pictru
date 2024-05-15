using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    [Route("api/{imageId}/likes")]
    [ApiController]
    public class LikeController : ControllerBase
    {
        private readonly AppDbContext context;
        private readonly UserManager<User> _userManager;

        public LikeController(AppDbContext context, UserManager<User> userManager)
        {
            this.context = context;
            _userManager = userManager;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> LikeImage(int imageId)
        {
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;
            System.Console.WriteLine($"\n\n\nUser {userId} has liked Image {imageId}\n\n\n");
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

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DislikeImage(int imageId)
        {
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;
            var like = await context.Likes
                .FirstOrDefaultAsync(l => l.ImageId == imageId && l.UserId == userId);

            if (like == null)
            {
                return NotFound("Like not found.");
            }

            if (like.UserId != userId && !await _userManager.IsInRoleAsync(await _userManager.FindByIdAsync(userId), "Moderator"))
            {
                return Unauthorized();
            }

            context.Likes.Remove(like);
            await context.SaveChangesAsync(); // TODO: test this. Saving once not enough?

            var image = await context.Images.FindAsync(imageId);
            image.LikeCount--;
            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete]
        [Route("all")]
        [Authorize]
        public async Task<IActionResult> RemoveLikes(int imageId)
        {
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;

            var image = await context.Images.Include(i => i.User).FirstOrDefaultAsync(i => i.Id == imageId);
            if (image == null)
            {
                return NotFound("Image not found.");
            }

            var LikesToRemove = await context.Likes.Where(r => r.ImageId == imageId).ToListAsync();
            image.LikeCount = 0;
            context.Likes.RemoveRange(LikesToRemove);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}