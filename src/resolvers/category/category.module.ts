import { Module } from '@nestjs/common';

import { CategoryResolver } from './category.resolver';
import { PrismaService } from '../../services';

@Module({
  providers: [CategoryResolver, PrismaService],
})
export class CategoryModule {}
