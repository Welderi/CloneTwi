using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Services
{
    public class MessageService
    {
        private readonly UserGetter _userGetter;
        private readonly CloneTwiContext _context;

        public MessageService(UserGetter userGetter, CloneTwiContext context)
        {
            _userGetter = userGetter;
            _context = context;
        }

        public async Task<IActionResult?> AddAsync(MessageDTO model)
        {
            var user = await _userGetter.GetUser();

            var message = new Message
            {
                MessageText = model.MessageText,
                MessageUserId = user!.Id
            };

            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();

            return new OkObjectResult("Posted");
        }
    }
}
