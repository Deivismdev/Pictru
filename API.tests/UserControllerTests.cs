using API.Controllers;
using API.Data;
using API.Models;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.tests
{
	public class UserControllerTests
	{
		private readonly Mock<UserManager<User>> _mockUserManager;
		private readonly Mock<ITokenService> _mockTokenService;
		private readonly Mock<IMapper> _mockMapper;
		private readonly Mock<IImageService> _mockImageService;
		private readonly UserController _controller;
		private readonly AppDbContext _context;

		public UserControllerTests()
		{
			var options = new DbContextOptionsBuilder<AppDbContext>()
				.UseInMemoryDatabase(databaseName: "TestDatabase")
				.Options;

			_context = new AppDbContext(options);

			_mockUserManager = new Mock<UserManager<User>>(Mock.Of<IUserStore<User>>(), null, null, null, null, null, null, null, null);
			_mockTokenService = new Mock<ITokenService>();
			_mockMapper = new Mock<IMapper>();
			_mockImageService = new Mock<IImageService>();

			_controller = new UserController(_context, _mockUserManager.Object, _mockTokenService.Object, _mockMapper.Object, _mockImageService.Object);
		}

		[Fact]
		public void Test_ReturnsOkResult()
		{
			// Act
			var result = _controller.Test();

			// Assert
			var okResult = Assert.IsType<OkObjectResult>(result);
			Assert.Equal("Test successful", okResult.Value);
		}

		[Fact]
		public async Task Login_ReturnsUnauthorized_WhenUserNotFound()
		{
			// Arrange
			var loginDto = new LoginDto { UserName = "nonexistent", Password = "password" };
			_mockUserManager.Setup(x => x.FindByNameAsync(loginDto.UserName)).ReturnsAsync((User)null);

			// Act
			var result = await _controller.Login(loginDto);

			// Assert
			Assert.IsType<UnauthorizedResult>(result.Result);
		}

		[Fact]
		public async Task Login_ReturnsUnauthorized_WhenPasswordIncorrect()
		{
			// Arrange
			var loginDto = new LoginDto { UserName = "testuser", Password = "wrongpassword" };
			var user = new User { UserName = loginDto.UserName };
			_mockUserManager.Setup(x => x.FindByNameAsync(loginDto.UserName)).ReturnsAsync(user);
			_mockUserManager.Setup(x => x.CheckPasswordAsync(user, loginDto.Password)).ReturnsAsync(false);

			// Act
			var result = await _controller.Login(loginDto);

			// Assert
			Assert.IsType<UnauthorizedResult>(result.Result);
		}

		[Fact]
		public async Task Login_ReturnsUserDto_WhenCredentialsAreValid()
		{
			// Arrange
			var loginDto = new LoginDto { UserName = "testuser", Password = "correctpassword" };
			var user = new User { Id = "1", UserName = loginDto.UserName, Email = "test@example.com" };
			var roles = new List<string> { "User" };

			_mockUserManager.Setup(x => x.FindByNameAsync(loginDto.UserName)).ReturnsAsync(user);
			_mockUserManager.Setup(x => x.CheckPasswordAsync(user, loginDto.Password)).ReturnsAsync(true);
			_mockUserManager.Setup(x => x.GetRolesAsync(user)).ReturnsAsync(roles);
			_mockTokenService.Setup(x => x.GenerateToken(user)).ReturnsAsync("fake-jwt-token");

			// Act
			var result = await _controller.Login(loginDto);
			var okResult = result.Result as OkObjectResult;
			var userDto = okResult.Value as UserDto;

			// Assert
			Assert.NotNull(okResult);
			Assert.IsType<UserDto>(userDto);
			Assert.Equal(user.Id, userDto.UserId);
			Assert.Equal(user.UserName, userDto.UserName);
			Assert.Equal(user.Email, userDto.Email);
			Assert.Equal("fake-jwt-token", userDto.Token);
			Assert.Equal(roles, userDto.Roles);
		}
	}
}
