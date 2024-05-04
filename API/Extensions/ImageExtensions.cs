using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using API.Models.Enums;

namespace API.Extensions
{
    public static class ImageExtensions
    {
        public static IQueryable<Image> Sort(this IQueryable<Image> query, string orderBy)
        {
            if (string.IsNullOrEmpty(orderBy)) return query.OrderBy(i => i.UploadDate);
            query = orderBy switch
            {
                "viewcountasc" => query.OrderBy(i => i.ViewCount),
                "viewcountdesc" => query.OrderByDescending(i => i.ViewCount),
                "uploaddatedesc" => query.OrderByDescending(i => i.UploadDate),
                _ => query.OrderBy(i => i.UploadDate)
            };
            return query;
        }

        public static IQueryable<Image> FilterByTag(this IQueryable<Image> query, TagNames? tag)
        {
            if (!tag.HasValue)
            {
                return query;
            }
            return query.Where(i => i.Tags.Any(t => t.Name == tag));
        }
    }
}