using System.ComponentModel.DataAnnotations;

namespace CloneTwiAPI.DTOs
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Je nutné zadat uživatelské jméno")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Je nutné zadat e-mail")]
        [EmailAddress(ErrorMessage = "Neplatná e-mailová adresa")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Je nutné zadat heslo")]
        [MinLength(6, ErrorMessage = "Heslo musí mít více než 6 znaků")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Je nutné zadat potvrzení hesla")]
        [Compare("Password", ErrorMessage = "Hesla se neshodují")]
        public string ConfirmPassword { get; set; }
    }
}
