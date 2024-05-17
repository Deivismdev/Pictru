using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Models;
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
        public async Task<IActionResult> CreatePaymentIntent()
        {
            var userId = User.Claims.SingleOrDefault(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")).Value;

            var user = await _context.Users.FirstOrDefaultAsync(i => i.Id == userId);
            var intent = await _paymentService.CreatePaymentIntent(user);
            if (intent == null) return BadRequest(new ProblemDetails { Title = "Died creating payment intent" });
            // user.PaymentIntentId = intent.Id;
            // user.ClientSecret = intent.ClientSecret;
            _context.Update(user);

            var result = await _context.SaveChangesAsync() > 0;
            if (!result) return BadRequest(new ProblemDetails { Title = "Died updating user's payment intent" });

            //TODO: OK? created? eh what is rest anyway
            return Ok();
        }
    }
}