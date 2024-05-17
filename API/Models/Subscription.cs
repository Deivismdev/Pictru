using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using API.Models.Enums;

namespace API.Models
{
    public class Subscription
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public long Price { get; set; } = 5;
        public DateTime SubscriptionStart { get; set; }
        public DateTime SubscriptionEnd { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        [JsonIgnore]
        public User User { get; set; }
    }
}