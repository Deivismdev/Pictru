using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Models;
using API.Models.Enums;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/payments")]

    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly PaymentService _paymentService;
        private readonly AppDbContext _context;
        public PaymentsController(PaymentService paymentService, AppDbContext context)
        {
            _context = context;
            _paymentService = paymentService;

        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<PremiumSubscriptionDto>> CreateNewSubscriptionAndPaymentIntent()
        {
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;
            System.Console.WriteLine($"\n\n\nUSER: {userId} IS DOING STUFF\n\n\n");
            // TODO: this is a bit stupid, UserController has (un)SetPremiumAsync where this should be done
            // doing it like this basically assumes that user clicking to get premium WILL pay for it

            var subscription = new PremiumSubscription
            {
                UserId = userId,
                SubscriptionStart = DateTime.UtcNow,
                SubscriptionEnd = DateTime.UtcNow.AddMonths(1),
                PaymentStatus = PaymentStatus.Pending
            };

            _context.PremiumSubscriptions.Add(subscription);
            await _context.SaveChangesAsync();

            var intent = await _paymentService.CreateOrUpdatePaymentIntent(subscription);
            if (intent == null) return BadRequest(new ProblemDetails { Title = "Creating payment intent failed" });

            subscription.PaymentIntentId = intent.Id;
            subscription.ClientSecret = intent.ClientSecret;

            _context.Update(subscription);
            var result = await _context.SaveChangesAsync() > 0;
            if (!result) return BadRequest(new ProblemDetails { Title = "Failed to update subscription with payment intent" });

            var SubscriptionDto = new PremiumSubscriptionDto
            {
                Id = subscription.Id,
                UserId = userId,
                PaymentIntentId = subscription.PaymentIntentId,
                ClientSecret = subscription.ClientSecret,
            };
            return Ok(SubscriptionDto);
        }
    }
}