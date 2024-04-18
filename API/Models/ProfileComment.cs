using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class ProfileComment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime Date = DateTime.Now;
        public bool Edited = false;
    }
}