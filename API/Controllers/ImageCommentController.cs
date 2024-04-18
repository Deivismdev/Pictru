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
    [Route("api/{imageId}/comments")]
    [ApiController]
    public class ImageCommentController : ControllerBase
    {
        private readonly AppDbContext context;
        public ImageCommentController(AppDbContext context)
        {
            this.context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetComments(int imageId)
        {
            var comments = await context.ImageComments
                .Where(i => i.Image.Id == imageId)
                .ToListAsync();

            if (comments.Count == 0)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpGet("{commentId}")]
        public async Task<IActionResult> GetComment(int imageId, int commentId)
        {
            var comment = await context.ImageComments
                .Where(i => i.Image.Id == imageId && i.Id == commentId)
                .FirstOrDefaultAsync();

            if (comment == null)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment(int imageId, GetImageCommentDto commentDto)
        {                                                           // uh dto naujo reik CreateImageCommentDto
            var image = await context.Images.FindAsync(imageId);
            if (image == null)
            {
                return NotFound();
            }

            var comment = new ImageComment
            {
                Text = commentDto.Text,
                XCoord = commentDto.XCoord,
                YCoord = commentDto.YCoord
            };

            context.ImageComments.Add(comment);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetComment", new { imageId, commentId = comment.Id }, comment);
            // return CreatedAtAction("GetComment", new { imageId, commentId = comment.Id }, comment);
        }

        [HttpPut("{commentId}")]
        public async Task<IActionResult> UpdateComment(int imageId, int commentId, UpdateImageCommentDto imageDto)
        {
            // edit comments or nah?
            return Ok();
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int imageId, int commentId)
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