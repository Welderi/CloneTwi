using CloneTwiAPI.AutoMappers;
using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Services
{
    public class EmojiService : GenericService<EmojiDTO, EmojiMessage>
    {
        public EmojiService(CloneTwiContext context, UserGetter userGetter)
            : base(context, userGetter)
        { }

        public async Task<IActionResult> AddEmojiAsync(EmojiDTO dto)
        {
            var result = await AddAsync(model: null, userBool: true,
                               messageId: dto.MessageId, entity: EmojiAutoMapper.ToEntity(dto));

            var savedEmoji = (EmojiMessage)((OkObjectResult)result).Value!;

            return new OkObjectResult(EmojiAutoMapper.ToDto(savedEmoji));
        }

        public async Task<IActionResult> RemoveEmojiAsync(int emojiId)
        {
            var emoji = _context.EmojiMessages.FirstOrDefault(e => e.EmojiId == emojiId);
            if (emoji == null) return new NotFoundResult();

            var result = await RemoveAsync(entity: emoji);

            return new OkObjectResult(result);
        }

        public async Task<IEnumerable<EmojiDTO>> GetAllEmojisForUser()
        {
            var user = await _userGetter.GetUser();

            var result = _context.EmojiMessages
                .Where(u => u.EmojiUserId == user!.Id)
                .ToList()
                .Select(EmojiAutoMapper.ToDto);

            return result;
        }
    }
}
