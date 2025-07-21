namespace CloneTwiAPI.Services
{
    public static class UploadService
    {
        private static string webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        public static async Task<string> Upload(string directory, IFormFile file)
        {
            var uploadsFolder = Path.Combine(webRootPath, directory);
            Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/{directory}/" + fileName;
        }
    }
}
