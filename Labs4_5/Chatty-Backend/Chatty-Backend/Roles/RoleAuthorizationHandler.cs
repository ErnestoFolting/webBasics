using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Chatty_Backend.Roles
{
    public class RoleAuthorizationHandler : AuthorizationHandler<RoleRequirement>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context, RoleRequirement requirement)
        {
            var user = context.User;

            if (user.HasClaim(c => c.Type == ClaimTypes.Role && c.Value == requirement.Role))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
