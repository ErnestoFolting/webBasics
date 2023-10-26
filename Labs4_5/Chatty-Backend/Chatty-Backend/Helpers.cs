using Chatty_Backend.UserData;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Chatty_Backend
{
    public class Helpers
    {
        public static string APP_URL;
        public static string JWT_SECRET;
        public static string GenerateJwtToken(string username, UserRolesEnum role)
        {
            var claims = new[]
            {
                new Claim("user", username),
                new Claim("role", Convert.ToString(role)),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: APP_URL,
                audience: APP_URL,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWT_SECRET)),
                    SecurityAlgorithms.HmacSha256
                )
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static string CreateMD5(string input)
        {
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);
                return Convert.ToHexString(hashBytes);
            }
        }
    }
}