using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Models.Enums;

namespace API.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public TagNames Name { get; set; }
    }
}