using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using API.Models.Enums;

namespace API.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public TagNames Name { get; set; }
        [JsonIgnore]
        public ICollection<Image> Images { get; set; } = new List<Image>();
    }

    public class GetTagDto
    {
        public int Name { get; set; }
    }

}