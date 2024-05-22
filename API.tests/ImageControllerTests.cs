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
    public class ImageControllerTests : IDisposable
    {
        private readonly Mock<IImageService> _mockImageService;
        private readonly IMapper _mapper;
        private readonly Mock<ITokenService> _mockTokenService;
        private readonly Mock<UserManager<User>> _mockUserManager;
        private AppDbContext _context;
        private ImageController _controller;

        public ImageControllerTests()
        {
            _mockImageService = new Mock<IImageService>();
            _mockTokenService = new Mock<ITokenService>();

            var store = new Mock<IUserStore<User>>();
            _mockUserManager = new Mock<UserManager<User>>(store.Object, null, null, null, null, null, null, null, null);

            _mapper = AutoMapperConfig.GetMapper();
        }

        private void SetupControllerWithFreshContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unique database for each test
                .Options;
            _context = new AppDbContext(options);

            _controller = new ImageController(_context, _mapper, _mockTokenService.Object, _mockUserManager.Object, _mockImageService.Object);

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
        public async Task CreateImage_ReturnsOkResult_WhenImageIsCreatedSuccessfully()
        {
            // Arrange
            SetupControllerWithFreshContext();
            var userId = "test-user-id";
            var createImageDto = new CreateImageDto
            {
                Name = "Test Image",
                Description = "Test Description",
                File = new FormFile(null, 0, 1024, null, "test.jpg"),
                Tags = new List<TagNames> { TagNames.Painting }
            };

            var imageUploadResult = new ImageUploadResult
            {
                SecureUrl = new Uri("http://example.com/image.jpg"),
                PublicId = "public-id"
            };

            _mockImageService.Setup(x => x.AddImageAsync(It.IsAny<IFormFile>())).ReturnsAsync(imageUploadResult);

            // Adding tag and user to in-memory database
            _context.Tags.Add(new Tag { Name = TagNames.Painting });
            _context.Users.Add(new User { Id = userId, UserName = "testuser", Reputation = 0 });
            _context.SaveChanges();

            SetUserClaims(userId);

            // Act
            var result = await _controller.CreateImage(createImageDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value as GetImageDto;
            Assert.NotNull(returnValue);
            Assert.Equal("Test Image", returnValue.Name);

            var updatedUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            Assert.NotNull(updatedUser);
            Assert.Equal(10, updatedUser.Reputation);
        }

        [Fact]
        public async Task GetImage_ReturnsOkResult_WhenImageExists()
        {
            // Arrange
            SetupControllerWithFreshContext();
            var userId = "test-user-id";
            var image = new Image
            {
                Id = 1,
                Name = "Test Image",
                Description = "Test Description",
                UserId = userId,
                ViewCount = 0,
                Tags = new List<Tag> { new Tag { Name = TagNames.Painting } },
            };
            _context.Images.Add(image);
            _context.Users.Add(new User { Id = userId, UserName = "testuser" });
            _context.SaveChanges();

            // Act
            var result = await _controller.GetImage(image.Id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value as GetImageDto;
            Assert.NotNull(returnValue);
            Assert.Equal("Test Image", returnValue.Name);
            Assert.Equal(1, returnValue.ViewCount);
        }

        [Fact]
        public async Task GetImage_ReturnsNotFound_WhenImageDoesNotExist()
        {
            // Arrange
            SetupControllerWithFreshContext();

            // Act
            var result = await _controller.GetImage(999);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetImageLoggedIn_ReturnsOkResult_WithLikedFlag()
        {
            // Arrange
            SetupControllerWithFreshContext();
            var userId = "test-user-id";
            var image = new Image
            {
                Id = 1,
                Name = "Test Image",
                Description = "Test Description",
                UserId = userId,
                ViewCount = 0,
                Tags = new List<Tag> { new Tag { Name = TagNames.Painting } },
            };
            var like = new Like { ImageId = image.Id, UserId = userId };
            _context.Images.Add(image);
            _context.Users.Add(new User { Id = userId, UserName = "testuser" });
            _context.Likes.Add(like);
            _context.SaveChanges();

            SetUserClaims(userId);

            // Act
            var result = await _controller.GetImageLoggedIn(image.Id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value as GetImageDto;
            Assert.NotNull(returnValue);
            Assert.True(returnValue.Liked);
            Assert.Equal(1, returnValue.ViewCount);
        }

        [Fact]
        public async Task UpdateImage_ReturnsNoContent_WhenImageIsUpdated()
        {
            // Arrange
            SetupControllerWithFreshContext();
            var userId = "test-user-id";
            var image = new Image
            {
                Id = 1,
                Name = "Test Image",
                Description = "Test Description",
                UserId = userId,
                Tags = new List<Tag> { new Tag { Name = TagNames.Painting } }
            };
            _context.Images.Add(image);
            _context.Users.Add(new User { Id = userId, UserName = "testuser" });
            _context.SaveChanges();

            SetUserClaims(userId);

            var updateImageDto = new UpdateImageDto
            {
                Name = "Updated Image",
                Description = "Updated Description",
                Tags = new List<TagNames> { TagNames.Painting }
            };

            // Act
            var result = await _controller.UpdateImage(image.Id, updateImageDto);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var updatedImage = _context.Images.FirstOrDefault(i => i.Id == image.Id);
            Assert.Equal("Updated Image", updatedImage.Name);
            Assert.Equal("Updated Description", updatedImage.Description);
        }

        [Fact]
        public async Task DeleteImage_ReturnsNoContent_WhenImageIsDeleted()
        {
            // Arrange
            SetupControllerWithFreshContext();
            var userId = "test-user-id";
            var image = new Image
            {
                Id = 1,
                Name = "Test Image",
                Description = "Test Description",
                UserId = userId,
                PublicId = "public-id"
            };
            _context.Images.Add(image);
            _context.Users.Add(new User { Id = userId, UserName = "testuser" });
            _context.SaveChanges();

            SetUserClaims(userId);

            var deletionResult = new CloudinaryDotNet.Actions.DeletionResult
            {
                Result = "ok"
            };

            _mockImageService.Setup(x => x.DeleteImageAsync(image.PublicId)).ReturnsAsync(deletionResult);

            // Act
            var result = await _controller.DeleteImage(image.Id);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Null(_context.Images.FirstOrDefault(i => i.Id == image.Id));
        }

        [Fact]
        public async Task GetImages_ReturnsOkResult_WithPagedImages()
        {
            // Arrange
            SetupControllerWithFreshContext();
            var userId = "test-user-id";
            var images = new List<Image>
        {
            new Image { Id = 1, Name = "Image1", Description = "Description1", UserId = userId },
            new Image { Id = 2, Name = "Image2", Description = "Description2", UserId = userId },
            new Image { Id = 3, Name = "Image3", Description = "Description3", UserId = userId }
        };
            _context.Images.AddRange(images);
            _context.Users.Add(new User { Id = userId, UserName = "testuser" });
            _context.SaveChanges();

            // Act
            var result = await _controller.GetImages(pageNumber: 1, pageSize: 2);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value as IEnumerable<GetImagesDto>;
            Assert.NotNull(returnValue);
            Assert.Equal(2, returnValue.Count());
        }

        [Fact]
        public async Task AppealImageSuspension_ReturnsNoContent_WhenImageIsAppealed()
        {
            // Arrange
            SetupControllerWithFreshContext();
            var userId = "test-user-id";
            var image = new Image
            {
                Id = 1,
                Name = "Test Image",
                Description = "Test Description",
                UserId = userId,
                State = ImageStates.Suspended,
                Tags = new List<Tag> { new Tag { Name = TagNames.Painting } }
            };
            _context.Images.Add(image);
            _context.Users.Add(new User { Id = userId, UserName = "testuser" });
            _context.SaveChanges();

            SetUserClaims(userId);

            var appealImageSuspensionDto = new AppealImageSuspensionImageDto
            {
                Tags = new List<TagNames> { TagNames.Painting }
            };

            // Act
            var result = await _controller.AppealImageSuspension(image.Id, appealImageSuspensionDto);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var appealedImage = _context.Images.FirstOrDefault(i => i.Id == image.Id);
            Assert.Equal(ImageStates.Appealed, appealedImage.State);
            Assert.Equal(1, appealedImage.Tags.Count);
            Assert.Equal(TagNames.Painting, appealedImage.Tags.First().Name);
        }
    }
}
