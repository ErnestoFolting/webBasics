﻿using Microsoft.AspNetCore.Authorization;

namespace Chatty_Backend.Roles
{
    public class RoleRequirement : IAuthorizationRequirement
    {
        public string Role { get; }

        public RoleRequirement(string role)
        {
            Role = role;
        }
    }
}
