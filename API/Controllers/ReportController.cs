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
    [Route("api/{imageId}/reports")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext context;
        private readonly UserManager<User> _userManager;

        public ReportController(UserManager<User> userManager, AppDbContext context)
        {
            this.context = context;
            _userManager = userManager;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ReportImage(int imageId)
        {
            System.Console.WriteLine("Hello?");
            // TODO: Prevent low rep users from reporting?
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;
            const int reportThreshold = 2;

            // increase threshold,
            // if mod reports, change state immediately to suspended
            // or just delete? what's the point of reporting
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
                image.State = ImageStates.Suspended;
                Console.WriteLine(image.User.Reputation);
                image.User.Reputation -= 10;
            }
            if (await _userManager.IsInRoleAsync(await _userManager.FindByIdAsync(userId), "Moderator"))
            {
                image.State = ImageStates.Suspended;
            }

            context.Images.Update(image);
            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> RemoveReports(int imageId)
        {
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;

            var image = await context.Images.Include(i => i.User).FirstOrDefaultAsync(i => i.Id == imageId);
            if (image == null)
            {
                return NotFound("Image not found.");
            }

            var reportsToRemove = await context.Reports.Where(r => r.ImageId == imageId).ToListAsync();
            image.ReportCount = 0;
            context.Reports.RemoveRange(reportsToRemove);
            await context.SaveChangesAsync();

            return NoContent();

        }
    }
}