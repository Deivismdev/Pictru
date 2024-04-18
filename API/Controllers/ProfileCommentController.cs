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
    [Route("api/{profileId}/comments")]
    [ApiController]
    public class ProfileCommentController : ControllerBase
    {

        private readonly AppDbContext context;
        public ProfileCommentController(AppDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetComments(int profileId)
        {
            var comments = await context.ProfileComments
                .Where(i => i.User.Id == profileId)
                .ToListAsync();

            if (comments.Count == 0)
            {
                return NotFound();
            }

            return Ok();
        }
        [HttpGet("{commentId}")]
        public async Task<IActionResult> GetComment(int profileId, int commentId)
        {
            var comment = await context.ProfileComments
                .Where(i => i.User.Id == profileId && i.Id == commentId)
                .FirstOrDefaultAsync();

            if (comment == null)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment(int userId, CreateProfileCommentDto commentDto)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var comment = new ProfileComment
            {
                Text = commentDto.Text,
            };

            context.ProfileComments.Add(comment);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetComment", new { userId, commentId = comment.Id }, comment);
            // return CreatedAtAction("GetComment", new { imageId, commentId = comment.Id }, comment);
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int profileId, int commentId)
        {
            var comment = await context.ProfileComments
                .Where(i => i.User.Id == profileId && i.Id == commentId)
                .FirstOrDefaultAsync();

            if (comment == null)
            {
                return NotFound();
            }

            context.ProfileComments.Remove(comment);
            await context.SaveChangesAsync();

            return NoContent();
        }

    }
}