using System.ComponentModel.DataAnnotations;

namespace CloneTwiAPI.DTOs
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "Неправильне ім'я користувача або електронна пошта")]
        public string UserNameEmail { get; set; }

        [Required(ErrorMessage = "Необхідно ввести пароль")]
        public string Password { get; set; }
    }
}
