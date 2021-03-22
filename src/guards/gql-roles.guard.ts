import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

function matchRoles(roles: string[], userRole: string) {
  userRole = userRole.toLowerCase();

  for (const role of roles) {
    if (role.toLowerCase() === userRole) {
      return true;
    }
  }

  return false;
}

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;

    if (!user) {
      return false;
    }

    return matchRoles(roles, user.roles);
  }
}
