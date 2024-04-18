using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models.Enums;

namespace API.Models
{
    public class ImageTag
    {
        public int Id { get; set; }
        public Tag TagName { get; set; }
    }
}