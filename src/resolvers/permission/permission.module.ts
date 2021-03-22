import { Module } from '@nestjs/common';

import { PermissionResolver } from './permission.resolver';
import { PrismaService } from '../../services';

@Module({
  providers: [PermissionResolver, PrismaService],
})
export class PermissionModule {}
