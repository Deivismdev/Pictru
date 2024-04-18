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
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext context;
        public ReportController(AppDbContext context)
        {
            this.context = context;
        }

        [HttpPost]
        public async Task<IActionResult> ReportImage(int imageId)
        {
            var userId = 1;
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
            await context.SaveChangesAsync();

            var image = await context.Images.FindAsync(imageId);
            image.ReportCount++;
            await context.SaveChangesAsync();

            return Ok();
        }
    }
}