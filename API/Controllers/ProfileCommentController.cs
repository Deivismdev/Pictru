using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/profiles/{userId}/comments")]
    [ApiController]
    public class ProfileCommentController : ControllerBase
    {

        private readonly AppDbContext context;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;


        public ProfileCommentController(AppDbContext context, UserManager<User> userManager, IMapper mapper)
        {
            this.context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfileComments(string userId)
        {
            var comments = await context.ProfileComments
                .Include(i => i.User)
                .Where(i => i.User.Id == userId)
                .ToListAsync();

            if (comments.Count == 0)
            {
                return NotFound();
            }
            var readCommentsDto = _mapper.Map<IEnumerable<GetProfileCommentsDto>>(comments);

            return Ok(readCommentsDto);
        }
        [HttpGet("{commentId}")]
        public async Task<IActionResult> GetProfileComment(string userId, int commentId)
        {
            var comment = await context.ProfileComments
                .Where(i => i.User.Id == userId && i.Id == commentId)
                .FirstOrDefaultAsync();

            if (comment == null)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPost]
        [Authorize]
        // TODO: userId = profile of the user where we want to leave a comment, rename to make it clearer
        public async Task<IActionResult> CreateProfileComment(string userId, CreateProfileCommentDto commentDto)
        {
            var currentUserId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;
            var user = await context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var comment = new ProfileComment
            {
                Text = commentDto.Text,
                UserId = currentUserId,
                User = user,
            };

            context.ProfileComments.Add(comment);
            await context.SaveChangesAsync();

            return Ok(comment);
            // return CreatedAtAction("GetComment", new { userId, commentId = comment.Id }, comment);
            // return CreatedAtAction("GetComment", new { imageId, commentId = comment.Id }, comment);
        }

        [HttpDelete("{commentId}")]
        [Authorize]
        // TODO: a bit confusing naming userId is id of the profile
        public async Task<IActionResult> DeleteProfileComment(string userId, int commentId)
        {
            var CurrentUserId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;
            var comment = await context.ProfileComments
                .Where(i => i.User.Id == userId && i.Id == commentId)
                .FirstOrDefaultAsync();

            // TODO: a bit hard to read
            // if comment was not left by the user OR it's not the users profile AND user is not MOD
            // (users can moderate comments on their profile)
            if (comment.UserId != CurrentUserId || userId != CurrentUserId && !await _userManager.IsInRoleAsync(await _userManager.FindByIdAsync(CurrentUserId), "Moderator"))
            {
                return Unauthorized();
            }

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