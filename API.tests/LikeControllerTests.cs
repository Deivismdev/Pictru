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
    public class LikeControllerTests : IDisposable
    {
        private readonly Mock<UserManager<User>> _mockUserManager;
        private AppDbContext _context;
        private LikeController _controller;

        public LikeControllerTests()
        {
            var store = new Mock<IUserStore<User>>();
            _mockUserManager = new Mock<UserManager<User>>(store.Object, null, null, null, null, null, null, null, null);
        }

        private void SetupControllerWithFreshContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new AppDbContext(options);

            _controller = new LikeController(_context, _mockUserManager.Object);

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

        [Fact]
        public async Task LikeImage_ReturnsOkResult_WhenLikeIsAdded()
        {
            // Arrange
            SetupControllerWithFreshContext();
            var userId = "test-user-id";
            var image = new Image { Id = 1, Name = "Test Image", LikeCount = 0 };
            _context.Images.Add(image);
            _context.Users.Add(new User { Id = userId, UserName = "testuser" });
            _context.SaveChanges();

            // Act
            var result = await _controller.LikeImage(image.Id);

            // Assert
            Assert.IsType<OkResult>(result);
            var like = await _context.Likes.FirstOrDefaultAsync(l => l.ImageId == image.Id && l.UserId == userId);
            Assert.NotNull(like);
            var updatedImage = await _context.Images.FindAsync(image.Id);
            Assert.Equal(1, updatedImage.LikeCount);
        }

        [Fact]
        public async Task LikeImage_ReturnsBadRequest_WhenAlreadyLiked()
        {
            // Arrange
            SetupControllerWithFreshContext();
            var userId = "test-user-id";
            var image = new Image { Id = 1, Name = "Test Image", LikeCount = 1 };
            _context.Images.Add(image);
            _context.Likes.Add(new Like { ImageId = image.Id, UserId = userId });
            _context.Users.Add(new User { Id = userId, UserName = "testuser" });
            _context.SaveChanges();

            // Act
            var result = await _controller.LikeImage(image.Id);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("You have already liked this image.", badRequestResult.Value);
        }

        [Fact]
        public async Task DislikeImage_ReturnsNoContent_WhenLikeIsRemoved()
        {
            // Arrange
            SetupControllerWithFreshContext();
            var userId = "test-user-id";
            var image = new Image { Id = 1, Name = "Test Image", LikeCount = 1 };
            _context.Images.Add(image);
            _context.Likes.Add(new Like { ImageId = image.Id, UserId = userId });
            _context.Users.Add(new User { Id = userId, UserName = "testuser" });
            _context.SaveChanges();

            // Act
            var result = await _controller.DislikeImage(image.Id);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var like = await _context.Likes.FirstOrDefaultAsync(l => l.ImageId == image.Id && l.UserId == userId);
            Assert.Null(like);
            var updatedImage = await _context.Images.FindAsync(image.Id);
            Assert.Equal(0, updatedImage.LikeCount);
        }

        [Fact]
        public async Task DislikeImage_ReturnsNotFound_WhenLikeDoesNotExist()
        {
            // Arrange
            SetupControllerWithFreshContext();
            var userId = "test-user-id";
            var image = new Image { Id = 1, Name = "Test Image", LikeCount = 0 };
            _context.Images.Add(image);
            _context.Users.Add(new User { Id = userId, UserName = "testuser" });
            _context.SaveChanges();

            // Act
            var result = await _controller.DislikeImage(image.Id);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task RemoveLikes_ReturnsNoContent_WhenLikesAreRemoved()
        {
            // Arrange
            SetupControllerWithFreshContext();
            var userId = "test-user-id";
            var image = new Image { Id = 1, Name = "Test Image", LikeCount = 2 };
            var likes = new List<Like>
        {
            new Like { ImageId = image.Id, UserId = userId },
            new Like { ImageId = image.Id, UserId = "another-user-id" }
        };
            _context.Images.Add(image);
            _context.Likes.AddRange(likes);
            _context.Users.Add(new User { Id = userId, UserName = "testuser" });
            _context.Users.Add(new User { Id = "another-user-id", UserName = "anotheruser" });
            _context.SaveChanges();

            // Act
            var result = await _controller.RemoveLikes(image.Id);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var removedLikes = await _context.Likes.Where(l => l.ImageId == image.Id).ToListAsync();
            Assert.Empty(removedLikes);
            var updatedImage = await _context.Images.FindAsync(image.Id);
            Assert.Equal(0, updatedImage.LikeCount);
        }
    }
}