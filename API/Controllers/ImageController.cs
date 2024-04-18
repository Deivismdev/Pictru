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

namespace API.Controllers
{
    [Route("api/image")]
    public class ImageController : ControllerBase
    {
        private readonly AppDbContext context;
        public ImageController(AppDbContext context)
        {
            this.context = context;
        }
        [HttpPost]
        public async Task<IActionResult> CreateImage(CreateImageDto imageDto)
        {
            var image = new Image
            {
                Name = imageDto.Name,
                Description = imageDto.Description,
                ImageUrl = imageDto.ImageUrl,
                UserId = 1,
                Tags = new List<ImageTag>()
            };

            Console.WriteLine(imageDto.Name, imageDto.Description, imageDto.ImageUrl);
            foreach (var tagId in imageDto.Tags)
            {
                var tag = context.Tags.FirstOrDefault(t => t.Name == tagId);
                if (tag != null)
                {
                    var imageTag = new ImageTag
                    {
                        TagName = tag
                    };
                    image.Tags.Add(imageTag);
                }
            }
            context.Images.Add(image);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetImage), new { imageId = image.Id }, image);
        }

        [HttpGet("{imageId}")]
        public IActionResult GetImage(int imageId)
        {
            var image = context.Images
                .FirstOrDefault(a => a.Id == imageId);

            if (image == null)
            {
                return NotFound();
            }
            var readImageDto = new ReadImageDto
            {
                Name = image.Name,
                Description = image.Description,
                ImageUrl = image.ImageUrl,
            };
            return Ok(readImageDto);
        }

        [HttpGet]
        public IActionResult GetImages()
        {
            var images = context.Images
            // .Include(i => i.User)
            // .Include(i => i.Likes)
            // .Include(i => i.Reports)
            // .Include(i => i.ImageComments)
            // .Include(i => i.Tags)
            // .Where(i => i.Tags.Any(t => t.TagName.Name == TagNames.Nature))
            .ToList();

            return Ok(images);
        }

        [HttpPut("{imageId}")]
        public async Task<IActionResult> UpdateImage(int imageId, UpdateImageDto imageDto)
        {
            var image = await context.Images.FirstOrDefaultAsync(i => i.Id == imageId);
            if (image == null)
            {
                return NotFound();
            }
            image.Name = imageDto.Name;
            image.Description = imageDto.Description;
            // this might be broken
            foreach (var tagId in imageDto.Tags)
            {
                var tag = context.Tags.FirstOrDefault(t => t.Name == tagId);
                if (tag != null)
                {
                    var imageTag = new ImageTag
                    {
                        TagName = tag
                    };
                    image.Tags.Add(imageTag);
                }
            }
            return Ok();
        }

        [HttpDelete("{imageId}")]
        public async Task<IActionResult> DeletImage(int imageId)
        {
            var album = await context.Images.FirstOrDefaultAsync(a => a.Id == imageId);
            if (album == null)
            {
                return NotFound();
            }


            context.Images.Remove(album);
            await context.SaveChangesAsync();

            return NoContent();
        }

    }
}