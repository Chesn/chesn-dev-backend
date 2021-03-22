import { Module } from '@nestjs/common';

import { RoleResolver } from './role.resolver';
import { RoleService, PrismaService } from '../../services';

@Module({
  providers: [RoleResolver, RoleService, PrismaService],
})
export class RoleModule {}
