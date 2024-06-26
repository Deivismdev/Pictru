using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Models;
using API.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using System.Security.Cryptography;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers
{
    [Route("api/image")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly AppDbContext context;
        private readonly IMapper mapper; // TODO: should use _ for private fields
        private readonly ITokenService _tokenService;
        private readonly UserManager<User> _userManager;

        private readonly IImageService _imageService;

        public ImageController(AppDbContext context, IMapper mapper, ITokenService tokenService, UserManager<User> userManager, IImageService imageService)
        {
            this.context = context;
            this.mapper = mapper;
            _tokenService = tokenService;
            _userManager = userManager;
            _imageService = imageService;
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateImage(CreateImageDto imageDto)
        {
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;

            var image = new Image
            {
                Name = imageDto.Name,
                Description = imageDto.Description,
                UserId = userId,
                Tags = new List<Tag>()
            };

            image.UserId = userId;

            if (imageDto.File != null)
            {
                var maxSize = 5 * 1024 * 1024;
                if (imageDto.File.Length > maxSize)
                {
                    return BadRequest(new ProblemDetails { Title = "File size exceeds the limit of 5MB." });
                }
                var imageResult = await _imageService.AddImageAsync(imageDto.File);

                if (imageResult.Error != null) return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                image.ImageUrl = imageResult.SecureUrl.ToString();
                image.PublicId = imageResult.PublicId;
            }

            foreach (var tagName in imageDto.Tags)
            {
                var tag = await context.Tags
                   .FirstOrDefaultAsync(t => t.Name == tagName);
                image.Tags.Add(tag);
            }

            context.Images.Add(image);

            var user = await context.Users.FirstOrDefaultAsync(i => i.Id == userId);
            user.Reputation += 10;

            await context.SaveChangesAsync();

            var readImageDto = mapper.Map<GetImageDto>(image);

            return Ok(readImageDto);
        }

        [HttpGet("{imageId}")]
        public async Task<IActionResult> GetImage(int imageId)
        {
            System.Console.WriteLine("\n\nGetting image (Guest)");

            var image = context.Images
                .Include(i => i.User)
                .Include(i => i.Tags)
                .Include(i => i.ImageComments).ThenInclude(ic => ic.User)
                .FirstOrDefault(i => i.Id == imageId);

            if (image == null)
            {
                return NotFound();
            }

            image.ViewCount += 1;
            await context.SaveChangesAsync();

            var readImageDto = mapper.Map<GetImageDto>(image);
            return Ok(readImageDto);
        }

        [HttpGet("loggedin/{imageId}")]
        [Authorize]
        // TODO: idk how else to do this, i need to check for user id to check for likes
        // There has to be a better way
        public async Task<IActionResult> GetImageLoggedIn(int imageId)
        {
            System.Console.WriteLine("\n\nGetting image (logged in)");
            var image = context.Images
                .Include(i => i.User)
                .Include(i => i.Tags)
                .Include(i => i.ImageComments).ThenInclude(ic => ic.User)
                .FirstOrDefault(i => i.Id == imageId);

            if (image == null)
            {
                return NotFound();
            }
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;
            bool hasLiked = false;
            if (!string.IsNullOrEmpty(userId))
            {
                var like = await context.Likes
                   .FirstOrDefaultAsync(l => l.ImageId == imageId && l.UserId == userId);
                hasLiked = like != null;
            }
            image.ViewCount += 1;
            await context.SaveChangesAsync();

            var readImageDto = mapper.Map<GetImageDto>(image);
            readImageDto.Liked = hasLiked;
            return Ok(readImageDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetImages(string orderBy = "uploadDate", TagNames? tag = null, ImageStates? state = null, string username = null, int pageNumber = 1, int pageSize = 10)
        {
            var query = context.Images
                   .Include(i => i.User)
                   .Include(i => i.Tags)
                   //    .Include(i => i.ImageComments).ThenInclude(ic => ic.User)
                   .Sort(orderBy)
                   .FilterByTag(tag)
                   .FilterByState(state)
                   .FilterByUsername(username)
                   .AsQueryable();

            var images = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

            if (images == null || images.Count == 0)
            {
                return NotFound();
            }

            var readImagesDto = mapper.Map<IEnumerable<GetImagesDto>>(images);

            return Ok(readImagesDto);
        }

        [HttpPatch("{imageId}")]
        [Authorize]
        public async Task<IActionResult> UpdateImage(int imageId, UpdateImageDto imageDto)
        {
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;
            var image = await context.Images.Include(i => i.Tags).FirstOrDefaultAsync(i => i.Id == imageId);
            if (image == null)
            {
                return NotFound();
            }
            // TODO: extract this into a seperate method?
            if (image.UserId != userId && !await _userManager.IsInRoleAsync(await _userManager.FindByIdAsync(userId), "Moderator"))
            {
                return Unauthorized();
            }
            // hmm
            if (imageDto.Name != null)
            {
                image.Name = imageDto.Name;
            }
            if (imageDto.Description != null)
            {
                image.Description = imageDto.Description;
            }
            if (imageDto.Tags.Any())
            {
                image.Tags.Clear();

                foreach (var tagName in imageDto.Tags)
                {
                    var tag = await context.Tags.FirstOrDefaultAsync(t => t.Name == tagName);
                    image.Tags.Add(tag);
                }
            }

            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{imageId}")]
        [Authorize]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;
            var image = await context.Images.FirstOrDefaultAsync(a => a.Id == imageId);
            if (image == null)
            {
                return NotFound();
            }

            if (image.UserId != userId && !await _userManager.IsInRoleAsync(await _userManager.FindByIdAsync(userId), "Moderator"))
            {
                return Unauthorized();
            }

            // TODO: should never be null anyway?
            // check to see if deletion succeeded?
            // or log deleted images and delete from the log?
            // eh it should work
            if (!string.IsNullOrEmpty(image.PublicId))
                await _imageService.DeleteImageAsync(image.PublicId);

            context.Images.Remove(image);
            await context.SaveChangesAsync();

            return NoContent();
        }


        // also appeal is not a good name, since mods could set directly to protected
        [HttpPatch("suspended/{imageId}")]
        [Authorize]
        public async Task<IActionResult> AppealImageSuspension(int imageId, AppealImageSuspensionImageDto imageDto)
        {
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;
            var image = await context.Images.Include(i => i.Tags).FirstOrDefaultAsync(i => i.Id == imageId);
            if (image == null)
            {
                return NotFound();
            }

            if (image.UserId != userId && !await _userManager.IsInRoleAsync(await _userManager.FindByIdAsync(userId), "Moderator"))
            {
                return Unauthorized();
            }

            if (image.State != ImageStates.Suspended)
            {
                return BadRequest("Image is not suspended.");
            }

            image.Tags.Clear();

            foreach (var tagName in imageDto.Tags)
            {
                var tag = await context.Tags.FirstOrDefaultAsync(t => t.Name == tagName);
                image.Tags.Add(tag);
            }
            image.Description = imageDto.Description;
            image.State = ImageStates.Appealed;

            if (await _userManager.IsInRoleAsync(await _userManager.FindByIdAsync(userId), "Moderator"))
            {
                image.State = ImageStates.Active;
                image.ReportCount = 0;
            }

            context.Images.Update(image);
            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("appealed/{imageId}")]
        [Authorize]
        public async Task<IActionResult> ApproveAppealedImageSuspension(int imageId)
        {
            var image = await context.Images.Include(i => i.Tags).Include(i => i.Reports).FirstOrDefaultAsync(i => i.Id == imageId);
            if (image == null)
            {
                return NotFound();
            }

            if (image.State != ImageStates.Appealed)
            {
                return BadRequest("Image suspensions is not suspended.");
            }

            //TODO: state should change to protected
            // but fetching by two states (active and protected) is not supported rn too bad
            // (image can only have one state the way it is now)
            image.State = ImageStates.Active;
            image.ReportCount = 0;
            image.Reports.Clear();
            context.Images.Update(image);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}