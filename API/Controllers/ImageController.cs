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

namespace API.Controllers
{
    [Route("api/image")]
    public class ImageController : ControllerBase
    {
        private readonly AppDbContext context;
        private readonly IMapper mapper; // should use _ for private fields


        public ImageController(AppDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
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
            };

            foreach (var tagName in imageDto.Tags)
            {
                var tag = await context.Tags
                   .FirstOrDefaultAsync(t => t.Name == tagName);
                image.Tags.Add(tag);
            }

            context.Images.Add(image);
            await context.SaveChangesAsync();
            return StatusCode(201);
            // return CreatedAtAction(nameof(GetImage), new { imageId = image.Id }, image);
        }

        [HttpGet("{imageId}")]
        public async Task<IActionResult> GetImage(int imageId)
        {
            var image = context.Images.AsNoTracking()
                .Include(i => i.User)
                .Include(i => i.Tags)
                .Include(i => i.ImageComments)
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

        [HttpGet]
        public async Task<IActionResult> GetImages(string orderBy = "uploadDate", TagNames? tag = null, int pageNumber = 1, int pageSize = 10)
        {
            var query = context.Images
                    .Include(i => i.User)
                   .Include(i => i.Tags)
                   .Include(i => i.ImageComments)
                   .Sort(orderBy)
                   .FilterByTag(tag)
                   .AsQueryable();

            var images = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

            if (images == null || images.Count == 0)
            {
                return NotFound();
            }
            var readImagesDto = mapper.Map<IEnumerable<GetImageDto>>(images);

            return Ok(readImagesDto);
        }

        [HttpPatch("{imageId}")]
        public async Task<IActionResult> UpdateImage(int imageId, UpdateImageDto imageDto)
        {
            var image = await context.Images.Include(i => i.Tags).FirstOrDefaultAsync(i => i.Id == imageId);
            if (image == null)
            {
                return NotFound();
            }

            image.Name = imageDto.Name;
            image.Description = imageDto.Description;

            image.Tags.Clear();

            foreach (var tagName in imageDto.Tags)
            {
                var tag = await context.Tags.FirstOrDefaultAsync(t => t.Name == tagName);
                image.Tags.Add(tag);
            }
            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{imageId}")]
        public async Task<IActionResult> DeleteImage(int imageId)
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

        // idk about thi
        // also appeal is not a good name, since mods could set directly to protected
        [HttpPatch("suspended/{imageId}")]
        public async Task<IActionResult> AppealImageSuspension(int imageId, AppealImageSuspensionImageDto imageDto)
        {
            var image = await context.Images.Include(i => i.Tags).FirstOrDefaultAsync(i => i.Id == imageId);
            if (image == null)
            {
                return NotFound();
            }

            if (image.State != ImageState.Suspended)
            {
                return BadRequest("Image is not suspended.");
            }

            image.Tags.Clear();

            foreach (var tagName in imageDto.Tags)
            {
                var tag = await context.Tags.FirstOrDefaultAsync(t => t.Name == tagName);
                image.Tags.Add(tag);
            }
            // if user:
            image.State = ImageState.Appealed;

            // if admin:
            // image.State = ImageState.Protected;
            // image.ReportCount = 0;
            // 


            context.Images.Update(image);
            await context.SaveChangesAsync();

            return NoContent();
        }

        // [HttpPatch("appealed/{imageId}")]
        // public async Task<IActionResult> ApproveAppealedImageSuspension(int imageId, AppealImageSuspensionImageDto imageDto)
        // {
        //     var image = await context.Images.Include(i => i.Tags).FirstOrDefaultAsync(i => i.Id == imageId);
        //     if (image == null)
        //     {
        //         return NotFound();
        //     }

        //     if (image.State != ImageState.Suspended)
        //     {
        //         return BadRequest("Image is not suspended.");
        //     }

        //     image.Tags.Clear();

        //     foreach (var tagName in imageDto.Tags)
        //     {
        //         var tag = await context.Tags.FirstOrDefaultAsync(t => t.Name == tagName);
        //         image.Tags.Add(tag);
        //     }

        //     image.State = ImageState.Protected;
        //     image.ReportCount = 0;



        //     context.Images.Update(image);
        //     await context.SaveChangesAsync();

        //     return NoContent();
        // }
    }
}