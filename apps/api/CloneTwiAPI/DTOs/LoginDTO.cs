﻿using System.ComponentModel.DataAnnotations;

namespace CloneTwiAPI.DTOs
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "Username or email is required")]
        public string UserNameEmail { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}
