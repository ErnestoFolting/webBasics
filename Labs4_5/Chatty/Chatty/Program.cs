using Chatty;
using Chatty.Roles;
using Chatty.UserData;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

Helpers.APP_URL = builder.Configuration["APP_URL"];
Helpers.JWT_SECRET = builder.Configuration["JWT_SECRET"];

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

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("admin"));
});

builder.Services.AddSingleton<IAuthorizationHandler, RoleAuthorizationHandler>();

builder.Services.AddSignalR();

builder.Services.AddSingleton<ChatHub>();

builder.Services.AddEndpointsApiExplorer();
builder.Configuration.AddJsonFile("appsettings.json");

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORSPolicy",
        builder =>
        {
            builder
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .SetIsOriginAllowed(origin => true);
        });
});

var app = builder.Build();

app.UseRouting();


app.UseAuthorization();

app.UseAuthentication();

app.UseCors("CORSPolicy");

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChatHub>("/chatHub");
});

app.UseHttpsRedirection();

IHubContext<ChatHub> context = null;

await using (var scope = app.Services?.GetService<IServiceScopeFactory>()?.CreateAsyncScope())
{
    context = scope?.ServiceProvider?.GetRequiredService<IHubContext<ChatHub>>();
}


var users = JsonConvert.DeserializeObject<List<User>>(await File.ReadAllTextAsync("data.json"));


app.MapGet("/users", () =>
{
    return users;
}).RequireAuthorization();

app.MapPost("/users", (User user) =>
{
    if (!users.Any(el => el.Username == user.Username))
    {
        user.Password = Helpers.CreateMD5(user.Password);
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

app.MapGet("/users/{username}", (string username) =>
{
    var userProfile = users.Find(el => el.Username == username);
    if (userProfile != null) return Results.Ok(userProfile);
    return Results.BadRequest("User not found");
}).RequireAuthorization();

app.MapDelete("/users/{username}", (string username) =>
{
    var userToDelete = users.Find(el => el.Username == username);
    if(userToDelete != null)
    {
        users.Remove(userToDelete);
        string updatedJson = JsonConvert.SerializeObject(users, Formatting.Indented);
        File.WriteAllText("data.json", updatedJson);
        return Results.Ok("User deleted");
    }
    return Results.BadRequest("User not found");
}).RequireAuthorization("AdminPolicy");

app.MapPost("/login", (LoginData logindata) =>
{
    string username = logindata.username;
    string password = Helpers.CreateMD5(logindata.password);
    if (username != null && password != null)
    {
        User? loggedUser = users.Find(el => el.Username == username && el.Password == password);
        if (loggedUser != null)
        {
            string token = Helpers.GenerateJwtToken(loggedUser.Username, loggedUser.Role);
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

app.MapPost("/message", async () =>
{
    var user = "user";
    var message = "message";
    Console.WriteLine(JsonConvert.SerializeObject(context.Clients));
    await context!.Clients.All.SendAsync("ReceiveMessage", user, message);
});

app.Run();
