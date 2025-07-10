using CloneTwiAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CloneTwiAPI.Services
{
    public class GenerateJwtTokenService
    {
        private readonly byte[] _key;

        public GenerateJwtTokenService(IConfiguration config)
        {
            _key = Encoding.UTF8.GetBytes(config["JwtSettings:JwtKey"]!);
        }
        public string GenerateJwtToken(ApplicationUser model)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, model.Id),
                    new Claim(ClaimTypes.Name, model.UserName!)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(_key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
