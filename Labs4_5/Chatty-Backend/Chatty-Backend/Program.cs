using Chatty_Backend;
using Chatty_Backend.Hubs;
using Chatty_Backend.Roles;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

Helpers.APP_URL = builder.Configuration["APP_URL"];
Helpers.JWT_SECRET = builder.Configuration["JWT_SECRET"];

var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT_SECRET"]));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddCookie(option =>
{
    option.Cookie.Name = "accessToken";
})
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = Helpers.APP_URL,
            ValidAudience = Helpers.APP_URL,
            IssuerSigningKey = securityKey,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["accessToken"];
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("admin"));
});

builder.Services.AddSingleton<IAuthorizationHandler, RoleAuthorizationHandler>();
builder.Services.AddSingleton<ChatHub>();

builder.Services.AddSignalR();

builder.Services.AddControllers();

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

app.UseCors("CORSPolicy");

app.UseAuthentication();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapHub<ChatHub>("/chatHub");

app.MapControllers();

app.Run();