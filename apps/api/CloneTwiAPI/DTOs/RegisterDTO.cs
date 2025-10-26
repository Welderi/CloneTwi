using System.ComponentModel.DataAnnotations;

namespace CloneTwiAPI.DTOs
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Необхідно ввести ім'я користувача")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Необхідно ввести електронну пошту")]
        [EmailAddress(ErrorMessage = "Неправильна електронна пошта")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Необхідно ввести пароль")]
        [MinLength(6, ErrorMessage = "Пароль має бути довше 6 символів")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Необхідно ввести підтвердження пароль")]
        [Compare("Password", ErrorMessage = "Паролі не співпадають")]
        public string ConfirmPassword { get; set; }
    }
}
