using Moq;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CloudinaryDotNet.Actions;
using System.Linq.Expressions;
using API.Services;
using API.Data;
using API.Models;
using API.Controllers;
using API.Models.Enums;
using API.tests;


namespace API.tests
{
    public class ReportControllerTests : IDisposable
    {
        private AppDbContext _context;
        private ReportController _controller;

        public ReportControllerTests()
        {
            Setup();
        }

        private void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new AppDbContext(options);
            _controller = new ReportController(_context);

            SetUserClaims("test-user-id");
        }

        private void SetUserClaims(string userId)
        {
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
            new Claim(ClaimTypes.NameIdentifier, userId)
            }, "mock"));
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        public void Dispose()
        {
            _context?.Dispose();
        }

        private void AddUserToContext(string userId, string userName, int reputation = 50)
        {
            if (_context.Users.Find(userId) == null)
            {
                var user = new User { Id = userId, UserName = userName, Reputation = reputation };
                _context.Users.Add(user);
                _context.SaveChanges();
            }
        }

        [Fact]
        public async Task ReportImage_ReturnsOkResult_WhenReportIsAdded()
        {
            // Arrange
            Setup();
            var userId = "test-user-id";
            var image = new Image { Id = 1, Name = "Test Image", ReportCount = 0, State = ImageStates.Active, User = new User { Id = userId, Reputation = 50 } };
            _context.Images.Add(image);
            AddUserToContext(userId, "testuser");
            _context.SaveChanges();

            // Act
            var result = await _controller.ReportImage(image.Id);

            // Assert
            Assert.IsType<OkResult>(result);
            var report = await _context.Reports.FirstOrDefaultAsync(r => r.ImageId == image.Id && r.UserId == userId);
            Assert.NotNull(report);
            var updatedImage = await _context.Images.Include(i => i.User).FirstOrDefaultAsync(i => i.Id == image.Id);
            Assert.Equal(1, updatedImage.ReportCount);
            Assert.Equal(ImageStates.Active, updatedImage.State);
        }

        [Fact]
        public async Task ReportImage_ReturnsBadRequest_WhenAlreadyReported()
        {
            // Arrange
            Setup();
            var userId = "test-user-id";
            var image = new Image { Id = 1, Name = "Test Image", ReportCount = 1, State = ImageStates.Active, User = new User { Id = userId, Reputation = 50 } };
            _context.Images.Add(image);
            _context.Reports.Add(new Report { ImageId = image.Id, UserId = userId });
            AddUserToContext(userId, "testuser");
            _context.SaveChanges();

            // Act
            var result = await _controller.ReportImage(image.Id);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("You have already reported this image.", badRequestResult.Value);
        }

        [Fact]
        public async Task ReportImage_ChangesStateAndReducesReputation_WhenThresholdExceeded()
        {
            // Arrange
            Setup();
            var userId = "test-user-id";
            var image = new Image { Id = 1, Name = "Test Image", ReportCount = 1, State = ImageStates.Active, User = new User { Id = "owner-id", Reputation = 50 } };
            _context.Images.Add(image);
            AddUserToContext(userId, "testuser");
            AddUserToContext("owner-id", "owner", 50);
            _context.SaveChanges();

            // Act
            var result = await _controller.ReportImage(image.Id);

            // Assert
            Assert.IsType<OkResult>(result);
            var report = await _context.Reports.FirstOrDefaultAsync(r => r.ImageId == image.Id && r.UserId == userId);
            Assert.NotNull(report);
            var updatedImage = await _context.Images.Include(i => i.User).FirstOrDefaultAsync(i => i.Id == image.Id);
            Assert.Equal(2, updatedImage.ReportCount);
            Assert.Equal(ImageStates.Suspended, updatedImage.State);
            Assert.Equal(40, updatedImage.User.Reputation);
        }

        [Fact]
        public async Task RemoveReports_ReturnsNoContent_WhenReportsAreRemoved()
        {
            // Arrange
            Setup();
            var userId = "test-user-id";
            var image = new Image { Id = 1, Name = "Test Image", ReportCount = 2, State = ImageStates.Suspended, User = new User { Id = "owner-id", Reputation = 40 } };
            var reports = new List<Report>
        {
            new Report { ImageId = image.Id, UserId = userId },
            new Report { ImageId = image.Id, UserId = "another-user-id" }
        };
            _context.Images.Add(image);
            _context.Reports.AddRange(reports);
            AddUserToContext(userId, "testuser");
            AddUserToContext("another-user-id", "anotheruser");
            AddUserToContext("owner-id", "owner", 40);
            _context.SaveChanges();

            // Act
            var result = await _controller.RemoveReports(image.Id);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var removedReports = await _context.Reports.Where(r => r.ImageId == image.Id).ToListAsync();
            Assert.Empty(removedReports);
            var updatedImage = await _context.Images.Include(i => i.User).FirstOrDefaultAsync(i => i.Id == image.Id);
            Assert.Equal(0, updatedImage.ReportCount);
        }
    }

}