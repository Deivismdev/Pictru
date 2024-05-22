using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Controllers;
using API.Data;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace API.tests
{
    public class ProfileCommentControllerTests : IDisposable
    {
        private AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly Mock<UserManager<User>> _mockUserManager;
        private ProfileCommentController _controller;

        public ProfileCommentControllerTests()
        {
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

            _controller = new ProfileCommentController(_context, _mockUserManager.Object, _mapper);

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
        public async Task GetProfileComments_ReturnsOkResult_WhenCommentsExist()
        {
            SetupControllerWithFreshContext();
            // Arrange
            var profileId = "test-profile-id";
            var comments = new List<ProfileComment>
        {
            new ProfileComment { Id = 1, Text = "Test Comment 1", UserId = "test-user-id", ProfileId = profileId },
            new ProfileComment { Id = 2, Text = "Test Comment 2", UserId = "test-user-id", ProfileId = profileId }
        };

            _context.ProfileComments.AddRange(comments);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetProfileComments(profileId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value as IEnumerable<GetProfileCommentsDto>;
            Assert.NotNull(returnValue);
            Assert.Equal(2, returnValue.Count());
        }

        [Fact]
        public async Task GetProfileComments_ReturnsNotFoundResult_WhenNoCommentsExist()
        {
            SetupControllerWithFreshContext();
            // Act
            var result = await _controller.GetProfileComments("non-existing-profile-id");

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        // [Fact]
        // public async Task GetProfileComment_ReturnsOkResult_WhenCommentExists()
        // {
        //     // Arrange
        //     var profileId = "test-profile-id";
        //     var comment = new ProfileComment { Id = 1, Text = "Test Comment", UserId = "test-user-id", ProfileId = profileId };

        //     _context.ProfileComments.Add(comment);
        //     _context.SaveChanges();

        //     // Act
        //     var result = await _controller.GetProfileComment(profileId, 1);

        //     // Assert
        //     var okResult = Assert.IsType<OkObjectResult>(result);
        //     Assert.Equal(comment, okResult.Value);
        // }

        [Fact]
        public async Task GetProfileComment_ReturnsNotFoundResult_WhenCommentDoesNotExist()
        {
            SetupControllerWithFreshContext();
            // Arrange
            var profileId = "test-profile-id";

            // Act
            var result = await _controller.GetProfileComment(profileId, 999);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task CreateProfileComment_ReturnsOkResult_WhenCommentIsCreated()
        {
            SetupControllerWithFreshContext();
            // Arrange
            var profileId = "test-profile-id";
            var userId = "test-user-id";
            var commentDto = new CreateProfileCommentDto { Text = "Test Comment" };

            _context.Users.Add(new User { Id = profileId, UserName = "testuser" });
            _context.SaveChanges();

            SetUserClaims(userId);

            // Act
            var result = await _controller.CreateProfileComment(profileId, commentDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value as ProfileComment;
            Assert.NotNull(returnValue);
            Assert.Equal("Test Comment", returnValue.Text);
            Assert.Equal(userId, returnValue.UserId);
            Assert.Equal(profileId, returnValue.ProfileId);
        }

        [Fact]
        public async Task DeleteProfileComment_ReturnsNoContent_WhenCommentIsDeleted()
        {
            SetupControllerWithFreshContext();
            // Arrange
            var profileId = "test-profile-id";
            var commentId = 1;
            var userId = "test-user-id";
            var comment = new ProfileComment { Id = commentId, UserId = userId, ProfileId = profileId };

            _context.ProfileComments.Add(comment);
            _context.SaveChanges();

            SetUserClaims(userId);

            _mockUserManager.Setup(x => x.IsInRoleAsync(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteProfileComment(profileId, commentId);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Null(await _context.ProfileComments.FindAsync(commentId));
        }

        [Fact]
        public async Task DeleteProfileComment_ReturnsUnauthorizedResult_WhenUserIsNotAuthorized()
        {
            SetupControllerWithFreshContext();
            // Arrange
            var profileId = "test-profile-id";
            var commentId = 1;
            var userId = "test-user-id";
            var differentUserId = "different-user-id";
            var comment = new ProfileComment { Id = commentId, UserId = differentUserId, ProfileId = profileId };

            _context.ProfileComments.Add(comment);
            _context.SaveChanges();

            SetUserClaims(userId);

            _mockUserManager.Setup(x => x.IsInRoleAsync(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteProfileComment(profileId, commentId);

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
        }
    }
}