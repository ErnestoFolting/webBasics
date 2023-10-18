using Chatty;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT_SECRET"]));

var tokenValidationParameters = new TokenValidationParameters
{
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = securityKey,
    ValidateIssuer = false,
    ValidateAudience = false,
    ValidateLifetime = true,
    ClockSkew = TimeSpan.Zero
};

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = tokenValidationParameters;
    });

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Configuration.AddJsonFile("appsettings.json");

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();

var users = JsonConvert.DeserializeObject<List<User>>(await File.ReadAllTextAsync("data.json"));

app.MapPost("/users", (User user) =>
{
    if (!users.Any(el => el.Username == user.Username))
    {
        user.Password = CreateMD5(user.Password);
        users.Add(user);
        string updatedJson = JsonConvert.SerializeObject(users, Formatting.Indented);
        File.WriteAllText("data.json", updatedJson);
        return Results.Ok("Created new user");
    }
    else
    {
        return Results.Conflict("An user with this username already existing");
    }
});

app.MapGet("/users", () =>
{
    return users;
}).RequireAuthorization();

app.MapPost("/login", (LoginData logindata) =>
{
    string username = logindata.username;
    string password = CreateMD5(logindata.password);
    Console.WriteLine(username);
    Console.WriteLine(password);
    if (username != null && password != null)
    {
        User? loggedUser = users.Find(el => el.Username == username && el.Password == password);
        if(loggedUser != null)
        {
            string token = GenerateJwtToken(loggedUser.Username);
            return Results.Ok(token);
        }
        else
        {
            return Results.BadRequest("Incorrect login data");
        }
    }
    else
    {
        return Results.BadRequest("Incorrect login data");
    }
});

app.Run();

string GenerateJwtToken(string username)
{
    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, username),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var token = new JwtSecurityToken(
        issuer: builder.Configuration["APP_URL"],
        audience: builder.Configuration["APP_URL"],
        claims: claims,
        expires: DateTime.UtcNow.AddDays(1),
        signingCredentials: new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT_SECRET"])),
            SecurityAlgorithms.HmacSha256
        )
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

string CreateMD5(string input)
{
    using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
    {
        byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
        byte[] hashBytes = md5.ComputeHash(inputBytes);
        return Convert.ToHexString(hashBytes);
    }
}