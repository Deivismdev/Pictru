using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace API.Models
{
    public class ImageTag
    {
        public int ImageId { get; set; }
        public int TagId { get; set; }
        public Image Image { get; set; }
        public Tag Tag { get; set; }
    }
}