using System.ComponentModel.DataAnnotations;

namespace CloneTwiAPI.DTOs
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "Neplatné uživatelské jméno nebo e-mail")]
        public string UserNameEmail { get; set; }

        [Required(ErrorMessage = "Je nutné zadat heslo")]
        public string Password { get; set; }
    }
}
