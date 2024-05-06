using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/{imageId}/reports")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext context;
        public ReportController(AppDbContext context)
        {
            this.context = context;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ReportImage(int imageId)
        {
            // TODO: Prevent low rep users from reporting 
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;
            const int reportThreshold = 1;

            var existingReport = await context.Reports
                .FirstOrDefaultAsync(l => l.ImageId == imageId && l.UserId == userId);

            if (existingReport != null)
            {
                return BadRequest("You have already reported this image.");
            }

            var report = new Report
            {
                ImageId = imageId,
                UserId = userId,
                Date = DateTime.UtcNow
            };

            context.Reports.Add(report);

            // var image = await context.Images.FindAsync(imageId);
            var image = await context.Images.Include(i => i.User).FirstOrDefaultAsync(i => i.Id == imageId);

            image.ReportCount++;

            Console.WriteLine(image.State);
            if (image.ReportCount >= reportThreshold)
            {
                image.State = ImageState.Suspended;
                Console.WriteLine(image.User.Reputation);
                image.User.Reputation -= 10;
            }

            context.Images.Update(image);
            await context.SaveChangesAsync();

            return Ok();
        }
    }
}