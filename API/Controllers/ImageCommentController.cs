using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/images/{imageId}/comments")]
    [ApiController]
    public class ImageCommentController : ControllerBase
    {
        private readonly AppDbContext context;
        private readonly IMapper mapper;
        public ImageCommentController(AppDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }


        [HttpGet]
        public async Task<IActionResult> GetImageComments(int imageId)
        {
            var comments = await context.ImageComments
                .Where(i => i.Image.Id == imageId)
                .ToListAsync();

            if (comments.Count == 0)
            {
                return NotFound();
            }

            return Ok(comments);
        }

        [HttpGet("{commentId}")]
        public async Task<IActionResult> GetImageComment(int imageId, int commentId)
        {
            var comment = await context.ImageComments
                .Where(i => i.Image.Id == imageId && i.Id == commentId)
                .FirstOrDefaultAsync();

            if (comment == null)
            {
                return NotFound();
            }

            return Ok(comment);
        }

        [HttpPost]
        public async Task<IActionResult> CreateImageComment(int imageId, CreateImageCommentDto commentDto)
        {
            var image = await context.Images.FindAsync(imageId);
            if (image == null)
            {
                return NotFound();
            }

            var comment = new ImageComment
            {
                Text = commentDto.Text,
                XCoord = commentDto.XCoord,
                YCoord = commentDto.YCoord,
                UserId = 1,
                ImageId = image.Id
            };

            context.ImageComments.Add(comment);
            await context.SaveChangesAsync();

            return Ok(comment);
            // return CreatedAtAction("GetComment", new { imageId, commentId = comment.Id }, comment);
        }

        // [HttpPut("{commentId}")]
        // public async Task<IActionResult> UpdateImageComment(int imageId, int commentId, UpdateImageCommentDto imageDto)
        // {


        //     return Ok();
        // }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteImageComment(int imageId, int commentId)
        {
            var comment = await context.ImageComments
                .Where(i => i.Image.Id == imageId && i.Id == commentId)
                .FirstOrDefaultAsync();

            if (comment == null)
            {
                return NotFound();
            }

            context.ImageComments.Remove(comment);
            await context.SaveChangesAsync();

            return NoContent();
        }

    }
}