using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Services
{
    public class ThemeService : GenericService<ThemeDTO, ThemeMessage>
    {
        public ThemeService(CloneTwiContext context, UserGetter userGetter)
            : base(context, userGetter)
        {
        }

        public async Task<IActionResult> GetAllThemes()
        {
            var themes = await _context.ThemeMessages
                                       .AsNoTracking()
                                       .Select(t => t.ThemeType)
                                       .ToListAsync();

            return new OkObjectResult(themes);
        }
    }
}
