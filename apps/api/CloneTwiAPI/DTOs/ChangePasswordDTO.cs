using System.ComponentModel.DataAnnotations;

namespace MyflixAPI.DTOs
{
    public class ChangePasswordDTO
    {
        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string CurrentPassword { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string NewPassword { get; set; }
    }
}
