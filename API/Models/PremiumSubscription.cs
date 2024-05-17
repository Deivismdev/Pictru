using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using API.Models.Enums;

namespace API.Models
{
    // TODO: this whole class is a bit of an overkill for what I'm trying to do 
    // maybe simplify
    public class PremiumSubscription
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public long Price { get; set; } = 5;
        public DateTime SubscriptionStart { get; set; }
        public DateTime SubscriptionEnd { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        public string ClientSecret { get; set; }
        public string PaymentIntentId { get; set; }

        [JsonIgnore]
        public User User { get; set; }
    }

    public class PremiumSubscriptionDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string PaymentIntentId { get; set; }
        public string ClientSecret { get; set; }
    }
}