namespace CloneTwiAPI.DTOs
{
    public class AdditionalUserSettingsDTO
    {
        public string? Bio { get; set; }
        public IFormFile? ProfileImageUrl { get; set; }
        public IFormFile? Background { get; set; }
    }
}
