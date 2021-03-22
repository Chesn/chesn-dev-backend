import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { GqlRolesGuard } from '../guards/gql-roles.guard';

export function Auth(...roles: Array<string | string[]>) {
  return applyDecorators(
    SetMetadata('roles', roles.flat()),
    UseGuards(GqlAuthGuard, GqlRolesGuard),
  );
}
