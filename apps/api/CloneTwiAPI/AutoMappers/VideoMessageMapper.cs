using CloneTwiAPI.Models;
using CloneTwiAPI.Services;

namespace CloneTwiAPI.AutoMappers
{
    public static class VideoMessageMapper
    {
        public static async Task<VideoMessage> ToEntity(VideoMessage dto, IFormFile videoFile)
        {
            if (dto.VideoFile != null)
            {
                dto.VideoFile = await UploadService.Upload("videoImages", videoFile);
            }

            return dto;
        }
    }
}
