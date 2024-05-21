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
    public class ImageCommentControllerTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly Mock<UserManager<User>> _mockUserManager;
        private readonly ImageCommentController _controller;

        public ImageCommentControllerTests()
        {
            var store = new Mock<IUserStore<User>>();
            _mockUserManager = new Mock<UserManager<User>>(store.Object, null, null, null, null, null, null, null, null);

            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _context = new AppDbContext(options);

            _mapper = AutoMapperConfig.GetMapper();

            _controller = new ImageCommentController(_context, _mapper, _mockUserManager.Object);

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

        // TODO: problem duplicate keys in database, so clear the database
        // there's probably a better way of doing this
        public void Dispose()
        {
            _context.Database.EnsureDeleted();
        }

        [Fact]
        public async Task GetImageComments_ReturnsOkResult_WhenCommentsExist()
        {
            // Arrange
            var image = new Image { Id = 1, UserId = "test-user-id" };
            var comments = new List<ImageComment>
        {
            new ImageComment { Id = 1, Text = "Test Comment 1", UserId = "test-user-id", Image = image },
            new ImageComment { Id = 2, Text = "Test Comment 2", UserId = "test-user-id", Image = image }
        };

            _context.Images.Add(image);
            _context.ImageComments.AddRange(comments);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetImageComments(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value as IEnumerable<GetImageCommentsDto>;
            Assert.NotNull(returnValue);
            Assert.Equal(2, returnValue.Count());
        }

        [Fact]
        public async Task GetImageComments_ReturnsNotFoundResult_WhenNoCommentsExist()
        {
            // Arrange
            var image = new Image { Id = 1, UserId = "test-user-id" };
            _context.Images.Add(image);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetImageComments(1);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetImageComment_ReturnsOkResult_WhenCommentExists()
        {
            // Arrange
            var image = new Image { Id = 1, UserId = "test-user-id" };
            var comment = new ImageComment { Id = 1, Text = "Test Comment", UserId = "test-user-id", Image = image };

            _context.Images.Add(image);
            _context.ImageComments.Add(comment);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetImageComment(1, 1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(comment, okResult.Value);
        }

        [Fact]
        public async Task GetImageComment_ReturnsNotFoundResult_WhenCommentDoesNotExist()
        {
            // Arrange
            var image = new Image { Id = 1, UserId = "test-user-id" };
            _context.Images.Add(image);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetImageComment(1, 1);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task CreateImageComment_ReturnsOkResult_WhenCommentIsCreated()
        {
            // Arrange
            var imageId = 1;
            var userId = "test-user-id";
            var commentDto = new CreateImageCommentDto { Text = "Test Comment", XCoord = 0, YCoord = 0 };
            var image = new Image { Id = imageId, UserId = userId };

            _context.Images.Add(image);
            _context.SaveChanges();

            SetUserClaims(userId);

            // Act
            var result = await _controller.CreateImageComment(imageId, commentDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value as GetImageCommentDto;
            Assert.NotNull(returnValue);
            Assert.Equal("Test Comment", returnValue.Text);
        }

        [Fact]
        public async Task DeleteImageComment_ReturnsOkResult_WhenCommentIsDeleted()
        {
            // Arrange
            var imageId = 1;
            var commentId = 1;
            var userId = "test-user-id";
            var comment = new ImageComment { Id = commentId, UserId = userId, ImageId = imageId };

            _context.Images.Add(new Image { Id = imageId, UserId = userId });
            _context.ImageComments.Add(comment);
            _context.SaveChanges();

            SetUserClaims(userId);

            // Act
            var result = await _controller.DeleteImageComment(imageId, commentId);

            // Assert
            Assert.IsType<OkResult>(result);
            Assert.Null(await _context.ImageComments.FindAsync(commentId));
        }

        [Fact]
        public async Task DeleteImageComment_ReturnsNotFoundResult_WhenCommentDoesNotExist()
        {
            // Arrange
            var imageId = 1;
            var userId = "test-user-id";

            _context.Images.Add(new Image { Id = imageId, UserId = userId });
            _context.SaveChanges();

            SetUserClaims(userId);

            // Act
            var result = await _controller.DeleteImageComment(imageId, 999);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteImageComment_ReturnsUnauthorizedResult_WhenUserIsNotAuthorized()
        {
            // Arrange
            var imageId = 1;
            var commentId = 1;
            var userId = "test-user-id";
            var differentUserId = "different-user-id";
            var comment = new ImageComment { Id = commentId, UserId = differentUserId, ImageId = imageId };
            _context.Images.Add(new Image { Id = imageId, UserId = userId });
            _context.ImageComments.Add(comment);
            _context.SaveChanges();

            _mockUserManager.Setup(x => x.IsInRoleAsync(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(false);

            SetUserClaims(userId);

            // Act
            var result = await _controller.DeleteImageComment(imageId, commentId);

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
        }
    }
}