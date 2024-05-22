using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Controllers;
using API.Data;
using API.Models;
using API.Models.Enums;
using API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Stripe;

namespace API.tests
{
    public class PaymentsControllerTests : IDisposable
    {
        private AppDbContext _context;
        private PaymentsController _controller;
        private Mock<IPaymentService> _mockPaymentService;

        public PaymentsControllerTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new AppDbContext(options);
            _mockPaymentService = new Mock<IPaymentService>();
            _controller = new PaymentsController(_mockPaymentService.Object, _context);

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
        public async Task CreateNewSubscriptionAndPaymentIntent_ReturnsOkResult_WithValidSubscription()
        {
            // Arrange
            var userId = "test-user-id";
            var paymentIntent = new PaymentIntent
            {
                Id = "pi_12345",
                ClientSecret = "secret_12345"
            };
            _mockPaymentService.Setup(x => x.CreateOrUpdatePaymentIntent(It.IsAny<PremiumSubscription>()))
                .ReturnsAsync(paymentIntent);

            // Act
            var result = await _controller.CreateNewSubscriptionAndPaymentIntent();

            // Assert
            var actionResult = Assert.IsType<ActionResult<PremiumSubscriptionDto>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var subscriptionDto = Assert.IsType<PremiumSubscriptionDto>(okResult.Value);

            Assert.Equal(userId, subscriptionDto.UserId);
            Assert.Equal(paymentIntent.Id, subscriptionDto.PaymentIntentId);
            Assert.Equal(paymentIntent.ClientSecret, subscriptionDto.ClientSecret);

            var subscription = await _context.PremiumSubscriptions.FirstOrDefaultAsync(s => s.UserId == userId);
            Assert.NotNull(subscription);
            Assert.Equal(PaymentStatus.Pending, subscription.PaymentStatus);
            Assert.Equal(paymentIntent.Id, subscription.PaymentIntentId);
            Assert.Equal(paymentIntent.ClientSecret, subscription.ClientSecret);
        }

        [Fact]
        public async Task CreateNewSubscriptionAndPaymentIntent_ReturnsBadRequest_WhenPaymentIntentFails()
        {
            // Arrange
            _mockPaymentService.Setup(x => x.CreateOrUpdatePaymentIntent(It.IsAny<PremiumSubscription>()))
                .ReturnsAsync((PaymentIntent)null);

            // Act
            var result = await _controller.CreateNewSubscriptionAndPaymentIntent();

            // Assert
            var actionResult = Assert.IsType<ActionResult<PremiumSubscriptionDto>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var problemDetails = Assert.IsType<ProblemDetails>(badRequestResult.Value);
            Assert.Equal("Creating payment intent failed", problemDetails.Title);
        }
    }
}